import { send, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const body = await readBody(event);

  try {
    const formData = new FormData();
    if (!body || typeof body !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Request body is required",
      });
    }

    if (body && typeof body === "object") {
      Object.keys(body).forEach((key) => {
        const value = body[key];
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, String(v)));
        } else {
          formData.append(key, String(value));
        }
      });
    }

    const backendResponse = await $fetch.raw(backendUrl + "/download-model/", {
      method: "POST",
      body: formData,
      timeout: 600000, // 10 minutes
      retry: 0,
      signal: AbortSignal.timeout(600000),
      responseType: "arrayBuffer",
    });

    const contentType =
      backendResponse.headers.get("content-type") || "application/xml";
    const contentDisposition =
      backendResponse.headers.get("content-disposition") ||
      'attachment; filename="model_process.pnml"';

    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Content-Disposition", contentDisposition);

    const buffer = Buffer.from((backendResponse._data as ArrayBuffer) || []);

    return send(event, buffer);
  } catch (error) {
    console.error("[uploads.post.ts] error:", error);

    const err = error as any; // Type assertion for error handling

    // More specific error handling
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      console.error("Request timed out after 10 minutes");
      throw createError({
        statusCode: 408,
        statusMessage:
          "Request timeout - the backend service took too long to respond",
      });
    }

    if (err.code === "ECONNREFUSED" || err.message?.includes("fetch failed")) {
      console.error("Backend service not available:", backendUrl);
      throw createError({
        statusCode: 503,
        statusMessage:
          "Backend service unavailable - check if the service at " +
          backendUrl +
          " is running",
      });
    }

    // Propagate meaningful error to client
    throw createError({
      statusCode: 500,
      statusMessage:
        "Internal Server Error: " + (err.message || "Unknown error"),
    });
  }
});
