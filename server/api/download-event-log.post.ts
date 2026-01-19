import { send, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const body = await readBody(event);

  if (!body || typeof body !== "object" || !body.session_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "session_id is required",
    });
  }

  try {
    const formData = new FormData();
    formData.append("session_id", String(body.session_id));
    if (body.file_type) {
      formData.append("file_type", String(body.file_type));
    }

    const backendResponse = await $fetch.raw(
      backendUrl + "/download-event-log/",
      {
        method: "POST",
        body: formData,
        timeout: 600000,
        retry: 0,
        signal: AbortSignal.timeout(600000),
        responseType: "arrayBuffer",
      }
    );

    const contentType =
      backendResponse.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      backendResponse.headers.get("content-disposition") ||
      'attachment; filename="event_log.xes"';

    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Content-Disposition", contentDisposition);

    const buffer = Buffer.from((backendResponse._data as ArrayBuffer) || []);
    return send(event, buffer);
  } catch (error) {
    console.error("[download-event-log.post.ts] error:", error);

    const err = error as any;
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      throw createError({
        statusCode: 504,
        statusMessage: "Backend request timed out",
      });
    }

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Failed to download event log",
    });
  }
});
