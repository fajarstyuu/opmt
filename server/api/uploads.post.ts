export default defineEventHandler(async (event) => {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  const parts = await readMultipartFormData(event);

  try {
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
    }

    const formData = new FormData();

    for (const part of parts) {
      const p: any = part;

      if (p.filename) {
        // SELALU gunakan key 'file' untuk file uploads supaya FastAPI menerima sebagai UploadFile(file: UploadFile = File(...))
        const filename: string = (p.filename ?? "upload.bin") as string;
        const blob = new Blob([p.data], {
          type: p.type ?? "application/octet-stream",
        });
        formData.append("file", blob as any, filename);
      } else {
        // regular text field -> gunakan nama field as-is (mis. noise_threshold)
        const key = (p.name ?? "field") as string;
        const value = p.data ?? "";
        formData.append(key, String(value));
      }
    }

    // Nitro's $fetch will set multipart headers correctly when body is a FormData
    const res = await $fetch(backendUrl + "/discover-model/", {
      method: "POST",
      body: formData,
      timeout: 600000, // 10 minutes
      retry: 0, // Disable retries for long-running requests
      // Let Nitro/ofetch/undici set appropriate multipart and connection headers.
      // Do not set manual keep-alive header — undici rejects some formats as invalid.
      signal: AbortSignal.timeout(600000), // 10 minutes abort signal
    });

    return res;
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
