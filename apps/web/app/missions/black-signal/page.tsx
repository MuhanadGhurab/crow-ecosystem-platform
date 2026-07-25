import { cookies } from "next/headers";
import { LivingMissionService, type MissionResource } from "@ghuravia/data";
import {
  decodeSession,
  getSessionSecret,
  sessionCookieName,
} from "../../../lib/session";
import { getDb } from "../../../lib/server/db";
import { BlackSignalClient } from "./BlackSignalClient";

export default async function BlackSignalPage() {
  let initial: MissionResource | null = null;
  try {
    const jar = await cookies();
    const raw = jar.get(sessionCookieName())?.value;
    if (raw) {
      const session = decodeSession(raw, getSessionSecret());
      if (session) {
        const { db } = getDb();
        const svc = new LivingMissionService(db);
        initial = await svc.listPreferredActive(session.accountId);
      }
    }
  } catch {
    initial = null;
  }
  return <BlackSignalClient initialResource={initial} />;
}
