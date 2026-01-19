import axios from "axios";
import { CheckPayload } from "../../utils/createError";

export default defineEventHandler(async (event) => {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "BACKEND_URL is not defined",
    });
  }

  try {
    const payload = await readBody(event);
    const req_formData = new FormData();
    req_formData.append("session_id", payload.session_id);
    req_formData.append("model_name", payload.model_name);
    req_formData.append("noise_threshold", payload.noise_threshold);

    CheckPayload(payload, ["session_id", "model_name", "noise_threshold"]);

    const backendResponse = await axios.post(
      `${backendUrl}/discover-model-3/`,
      req_formData,
      {
        timeout: 600_000, // 10 menit
        headers: {},
      }
    );

    return backendResponse.data;
  } catch (error: any) {
    console.error("Error occurred while calling backend:", error);
    if (axios.isAxiosError(error)) {
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage:
          error.response?.data?.message ||
          "Failed to process request to backend",
        data: error.response?.data,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error",
    });
  }
});
