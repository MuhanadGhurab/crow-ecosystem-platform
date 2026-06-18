import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

export type PgClientKind = "local" | "docker";

export type PgBackupClient = {
  kind: PgClientKind;
  clientVersion: string;
  serverMajor: number;
  imageTag: string;
};

type PgConnection = {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
};

function runCapture(
  command: string,
  args: string[],
  options?: { shell?: boolean }
): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: options?.shell ?? process.platform === "win32",
    maxBuffer: 1024 * 1024 * 64,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function sslDatabaseUrl(url: string): string {
  if (/sslmode=/i.test(url)) return url;
  return url.includes("?") ? `${url}&sslmode=require` : `${url}?sslmode=require`;
}

function parsePgUrl(url: string): PgConnection {
  const parsed = new URL(sslDatabaseUrl(url));
  const database = parsed.pathname.replace(/^\//, "").split("?")[0];
  if (!database) {
    throw new Error("Database name missing from PostgreSQL URL.");
  }
  return {
    host: parsed.hostname,
    port: parsed.port || "5432",
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database,
  };
}

function dockerPgEnvArgs(connection: PgConnection): string[] {
  return [
    "-e",
    `PGHOST=${connection.host}`,
    "-e",
    `PGPORT=${connection.port}`,
    "-e",
    `PGUSER=${connection.user}`,
    "-e",
    `PGPASSWORD=${connection.password}`,
    "-e",
    `PGDATABASE=${connection.database}`,
    "-e",
    "PGSSLMODE=require",
  ];
}

function dockerLocalPgEnvArgs(connection: PgConnection): string[] {
  const host =
    connection.host === "127.0.0.1" || connection.host === "localhost"
      ? "host.docker.internal"
      : connection.host;
  return [
    "-e",
    `PGHOST=${host}`,
    "-e",
    `PGPORT=${connection.port}`,
    "-e",
    `PGUSER=${connection.user}`,
    "-e",
    `PGPASSWORD=${connection.password}`,
    "-e",
    `PGDATABASE=${connection.database}`,
  ];
}

function parseServerMajor(versionText: string): number {
  const match = versionText.match(/(\d+)/);
  if (!match) throw new Error(`Could not parse PostgreSQL server version from: ${versionText}`);
  return Number.parseInt(match[1] ?? "0", 10);
}

export function queryServerMajorVersion(directUrl: string): { major: number; raw: string } {
  const connection = parsePgUrl(directUrl);

  const local = runCapture("psql", [sslDatabaseUrl(directUrl), "-Atc", "SHOW server_version;"]);
  if (local.status === 0 && local.stdout.trim()) {
    const raw = local.stdout.trim();
    return { major: parseServerMajor(raw), raw };
  }

  for (const major of [17, 16, 15, 14]) {
    const docker = runCapture(
      "docker",
      [
        "run",
        "--rm",
        ...dockerPgEnvArgs(connection),
        `postgres:${major}-alpine`,
        "psql",
        "-Atc",
        "SHOW server_version;",
      ],
      { shell: false }
    );
    if (docker.status === 0 && docker.stdout.trim()) {
      const raw = docker.stdout.trim();
      return { major: parseServerMajor(raw), raw };
    }
  }

  throw new Error(
    "Could not query PostgreSQL server_version. Install psql or Docker with a postgres client image."
  );
}

export function resolvePgBackupClient(serverMajor: number): PgBackupClient {
  const imageTag = `postgres:${serverMajor}-alpine`;

  const localDump = runCapture("pg_dump", ["--version"]);
  if (localDump.status === 0) {
    const localMajor = parseServerMajor(localDump.stdout);
    if (localMajor >= serverMajor) {
      return {
        kind: "local",
        clientVersion: localDump.stdout.trim(),
        serverMajor,
        imageTag: "local",
      };
    }
  }

  const pull = runCapture("docker", ["pull", imageTag], { shell: false });
  if (pull.status !== 0) {
    throw new Error(
      `Could not pull ${imageTag}. Install PostgreSQL client >=${serverMajor} or ensure Docker can pull ${imageTag}.`
    );
  }

  const dockerDump = runCapture(
    "docker",
    ["run", "--rm", imageTag, "pg_dump", "--version"],
    { shell: false }
  );
  if (dockerDump.status !== 0) {
    throw new Error(`Docker ${imageTag} pg_dump is unavailable.`);
  }

  return {
    kind: "docker",
    clientVersion: dockerDump.stdout.trim(),
    serverMajor,
    imageTag,
  };
}

export function runPgDumpToFile(
  filePath: string,
  formatArgs: string[],
  directUrl: string,
  client: PgBackupClient
): void {
  const connection = parsePgUrl(directUrl);

  if (client.kind === "local") {
    const out = runCapture("pg_dump", [...formatArgs, "-f", filePath, sslDatabaseUrl(directUrl)]);
    if (out.status !== 0) {
      throw new Error(out.stderr.slice(0, 500) || "pg_dump failed");
    }
    return;
  }

  const docker = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      ...dockerPgEnvArgs(connection),
      client.imageTag,
      "pg_dump",
      ...formatArgs,
    ],
    { encoding: "buffer", shell: false, maxBuffer: 1024 * 1024 * 512 }
  );
  if (docker.status !== 0 || !docker.stdout?.length) {
    throw new Error((docker.stderr?.toString("utf8") ?? "docker pg_dump failed").slice(0, 500));
  }
  writeFileSync(filePath, docker.stdout);
}

export function runPgRestoreList(archivePath: string, client: PgBackupClient): string {
  if (client.kind === "local") {
    const out = runCapture("pg_restore", ["--list", archivePath]);
    if (out.status !== 0) throw new Error(out.stderr.slice(0, 500) || "pg_restore --list failed");
    return out.stdout;
  }

  const mountPath = archivePath.replace(/\\/g, "/");
  const docker = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-v",
      `${mountPath}:/backup.dump:ro`,
      client.imageTag,
      "pg_restore",
      "--list",
      "/backup.dump",
    ],
    { encoding: "utf8", shell: false, maxBuffer: 1024 * 1024 * 32 }
  );
  if (docker.status !== 0) {
    throw new Error((docker.stderr ?? "pg_restore --list failed").slice(0, 500));
  }
  return docker.stdout ?? "";
}

export function runPgRestoreToDatabase(
  archivePath: string,
  targetUrl: string,
  client: PgBackupClient
): { status: number | null; stderr: string } {
  const connection = parsePgUrl(targetUrl);

  if (client.kind === "local") {
    const out = runCapture("pg_restore", [
      "--no-owner",
      "--no-acl",
      "--dbname",
      targetUrl,
      archivePath,
    ]);
    return { status: out.status, stderr: out.stderr };
  }

  const mountPath = archivePath.replace(/\\/g, "/");
  const docker = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-v",
      `${mountPath}:/backup.dump:ro`,
      ...dockerLocalPgEnvArgs(connection),
      client.imageTag,
      "pg_restore",
      "--no-owner",
      "--no-acl",
      "-d",
      connection.database,
      "/backup.dump",
    ],
    { encoding: "utf8", shell: false, maxBuffer: 1024 * 1024 * 32 }
  );
  return { status: docker.status, stderr: docker.stderr ?? "" };
}

export function runPsqlCommand(
  targetUrl: string,
  sql: string,
  client: PgBackupClient
): { status: number | null; stdout: string; stderr: string } {
  const connection = parsePgUrl(targetUrl);

  if (client.kind === "local") {
    const out = runCapture("psql", [targetUrl, "-c", sql]);
    return { status: out.status, stdout: out.stdout, stderr: out.stderr };
  }

  const docker = runCapture(
    "docker",
    [
      "run",
      "--rm",
      ...dockerLocalPgEnvArgs(connection),
      client.imageTag,
      "psql",
      "-c",
      sql,
    ],
    { shell: false }
  );
  return { status: docker.status, stdout: docker.stdout, stderr: docker.stderr };
}

export function runPsqlQuery(targetUrl: string, sql: string, client: PgBackupClient): string {
  if (client.kind === "local") {
    const out = runCapture("psql", [targetUrl, "-Atc", sql]);
    if (out.status !== 0) throw new Error(out.stderr.slice(0, 500) || "psql failed");
    return out.stdout.trim();
  }

  const connection = parsePgUrl(targetUrl);
  const docker = runCapture(
    "docker",
    [
      "run",
      "--rm",
      ...dockerLocalPgEnvArgs(connection),
      client.imageTag,
      "psql",
      "-Atc",
      sql,
    ],
    { shell: false }
  );
  if (docker.status !== 0) throw new Error(docker.stderr.slice(0, 500) || "psql failed");
  return docker.stdout.trim();
}
