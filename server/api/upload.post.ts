// Helper function to get MIME type based on file extension
function getFileType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "xes":
      return "application/xml";
    case "gz":
      return "application/gzip";
    case "csv":
      return "text/csv";
    default:
      return "application/octet-stream";
  }
}

export default defineEventHandler(async (event) => {
  try {
    console.log("=== Upload Debug Info ===");

    // Read multipart form data
    const formData = await readMultipartFormData(event);
    console.log("FormData items:", formData?.length || 0);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file uploaded",
      });
    }

    // Find the file in the form data
    const fileData = formData.find((item) => item.name === "file");

    if (!fileData || !fileData.data) {
      console.log(
        "Available form fields:",
        formData.map((item) => ({ name: item.name, filename: item.filename }))
      );
      throw createError({
        statusCode: 400,
        statusMessage: "File not found in upload",
      });
    }

    console.log("File info:", {
      name: fileData.name,
      filename: fileData.filename,
      type: fileData.type,
      size: fileData.data.length,
    });

    const config = useRuntimeConfig();
    console.log("Backend URL:", config.backendURL);

    // Create FormData for backend request
    const backendFormData = new FormData();
    const mimeType = fileData.type || getFileType(fileData.filename || "");

    // For .xes.gz files, use gzip type
    const finalMimeType = fileData.filename?.endsWith(".xes.gz")
      ? "application/gzip"
      : mimeType;

    const blob = new Blob([fileData.data], { type: finalMimeType });
    backendFormData.append("file", blob, fileData.filename || "uploaded-file");

    console.log("Sending to backend with MIME type:", finalMimeType);

    const backendResponse = await $fetch(`${config.backendURL}/upload-log`, {
      method: "POST",
      body: backendFormData,
    });

    console.log("Upload successful:", backendResponse);
    return backendResponse;
  } catch (error: any) {
    console.error("Upload error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during file upload",
    });
  }
});
