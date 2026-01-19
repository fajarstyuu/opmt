export default defineEventHandler(async (event) => {
  const backendUrl = process.env.BACKEND_URL;
  const body = await readBody(event);
  const payload = new FormData();
  for (const key in body) {
    payload.append(key, body[key]);
  }

  try {
    const backendResponse = await $fetch(backendUrl + "/filter-event-log/", {
      method: "POST",
      body: payload,
      timeout: 600000, // 10 minutes
      retry: 0,
      signal: AbortSignal.timeout(600000),
    });

    return backendResponse;
  } catch (error) {
    console.error("[statistic.post.ts] error:", error);

    const err = error as any;
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      console.error("Request timed out after 10 minutes");
      throw createError({
        statusCode: 504,
        statusMessage: "Backend request timed out",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
