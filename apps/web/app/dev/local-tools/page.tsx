"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../../../lib/locale-context";

type MailboxResponse = {
  localOnly: true;
  messages: Array<{ token?: string; subject?: string; body?: string }>;
};

export default function LocalDevToolsPage() {
  const { msg } = useLocale();
  const [data, setData] = useState<MailboxResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/local/mock-mailbox", { credentials: "include" })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setError(String(body.category ?? "error"));
          return;
        }
        setData(body as MailboxResponse);
      })
      .catch(() => setError("error"));
  }, []);

  return (
    <main id="main" className="dev-tools">
      <h1>{msg("devToolsTitle")}</h1>
      <p role="note">{msg("devToolsWarning")}</p>
      <p>
        <a href="/activation/email-pending">{msg("act003Title")}</a>
      </p>
      {error ? <p role="alert">{error}</p> : null}
      {data ? (
        <section aria-labelledby="mailbox-heading">
          <h2 id="mailbox-heading">Mock mailbox</h2>
          <ul>
            {data.messages.map((m, i) => (
              <li key={i}>
                <span dir="ltr">{m.subject ?? "message"}</span>
                {m.token ? (
                  <p className="tech" dir="ltr">
                    token: {m.token}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
