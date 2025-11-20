import { ref } from "vue";

interface FileInfo {
  name: string;
  size: number;
  file: File;
}

interface UploadResponse {
  code: number;
  message: string;
  data: any;
}

export const useFile = () => {
  const fileInfo = useState<FileInfo | null>("uploadedFileInfo", () => null);

  // share the uploaded response across pages by using Nuxt useState
  const data = useState<any>("uploadedModel", () => null);
  const pending = ref(false);
  const error = ref<any>(null);

  function setFile(file: File) {
    fileInfo.value = {
      name: file.name,
      size: file.size,
      file,
    };
  }

  function clearFile() {
    fileInfo.value = null;
  }

  async function upload(
    file?: File,
    algorithm?: string,
    noiseThreshold?: number,
    variantsCoverage?: number,
    eventCoverage?: number
  ): Promise<UploadResponse> {
    const toUpload = file ?? fileInfo.value?.file;
    if (!toUpload) {
      throw new Error("No file provided for upload");
    }

    if (file) setFile(toUpload);

    const formData = new FormData();
    const processMiningAlgo = algorithm as string;
    let noise_threshold = noiseThreshold as number;
    let variants_coverage = variantsCoverage as number;
    let event_coverage = eventCoverage as number;
    if (!noise_threshold || noise_threshold < 0 || noise_threshold > 1)
      noise_threshold = 0;
    if (
      variants_coverage == null ||
      variants_coverage === undefined ||
      variants_coverage < 0 ||
      variants_coverage > 100
    )
      variants_coverage = 100;
    if (
      event_coverage == null ||
      event_coverage === undefined ||
      event_coverage < 0 ||
      event_coverage > 100
    )
      event_coverage = 100;
    formData.append("file", toUpload);
    formData.append("model", processMiningAlgo);
    formData.append("noise_threshold", noise_threshold.toString());
    formData.append("variants_coverage", variants_coverage.toString());
    formData.append("events_coverage", event_coverage.toString());

    pending.value = true;
    error.value = null;

    console.log("[useFile] upload called with:", {
      file: toUpload,
      model: processMiningAlgo,
      noise_threshold,
      variants_coverage,
      event_coverage,
    });
    try {
      const res = await $fetch<UploadResponse>("/api/uploads", {
        method: "POST",
        body: formData,
        timeout: 600000, // 10 minutes
      });
      data.value = res.data;
      return res;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      pending.value = false;
    }
  }

  return {
    fileInfo,
    setFile,
    clearFile,
    upload,
    data,
    pending,
    error,
  };
};
