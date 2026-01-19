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
    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)));
      } else {
        formData.append(key, String(value));
      }
    });

    const backendResponse = await $fetch(backendUrl + "/conformance-check/", {
      method: "POST",
      body: formData,
      timeout: 600000,
      retry: 0,
      signal: AbortSignal.timeout(600000),
    });

    return backendResponse;
  } catch (error) {
    console.error("[conformance.post.ts] error:", error);

    const err = error as any;
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      throw createError({
        statusCode: 504,
        statusMessage: "Backend request timed out",
      });
    }

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Failed to evaluate conformance",
    });
  }
});
