type Severity = "info" | "warn" | "error";

type LogEvent = {
  scope: string;
  message: string;
  severity?: Severity;
  metadata?: Record<string, unknown>;
};

export function logEvent(event: LogEvent) {
  const payload = {
    timestamp: new Date().toISOString(),
    severity: event.severity ?? "info",
    scope: event.scope,
    message: event.message,
    metadata: event.metadata ?? {},
  };

  if (payload.severity === "error") {
    console.error("[observability]", payload);
    return;
  }
  if (payload.severity === "warn") {
    console.warn("[observability]", payload);
    return;
  }
  console.info("[observability]", payload);
}

export function captureException(scope: string, error: unknown, metadata?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : "Unknown error";
  logEvent({
    scope,
    message,
    severity: "error",
    metadata: {
      ...metadata,
      stack: error instanceof Error ? error.stack : undefined,
      sentryConfigured: Boolean(process.env.SENTRY_DSN),
    },
  });
}
