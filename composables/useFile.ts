import { ref } from "vue";
import { calculateSessionId } from "../utils/calculateSession";
// import { useConformance } from "./useConformance";

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

interface FilterSnapshot {
  algorithm: string;
  noiseThreshold: number;
  variantsCoverage: number;
  eventCoverage: number;
  caseDurationMin?: number | null;
  caseDurationMax?: number | null;
  numberOfEventsMin?: number | null;
  numberOfEventsMax?: number | null;
}

// const { conformanceData } = useConformance();

export const useFile = () => {
  const fileInfo = useState<FileInfo | null>("uploadedFileInfo", () => null);

  // share the uploaded response across pages by using Nuxt useState
  const data = useState<any>("uploadedModel", () => null);
  const baseData = useState<any>("uploadedModelBase", () => null);
  const pending = ref(false);
  const error = ref<any>(null);
  const lastRequestParams = useState<FilterSnapshot | null>(
    "uploadedLastParams",
    () => null
  );

  function setFile(file: File) {
    fileInfo.value = {
      name: file.name,
      size: file.size,
      file,
    };
  }

  function clearFile() {
    fileInfo.value = null;
    data.value = null;
    baseData.value = null;
  }

  interface FilterParams {
    session_id?: string;
    file?: File;
    algorithm?: string;
    noiseThreshold?: number;
    variantsCoverage?: number;
    eventCoverage?: number;
    caseDurationMin?: number;
    caseDurationMax?: number;
    numberOfEventsMin?: number;
    numberOfEventsMax?: number;
  }

  interface Parameter {
    file?: File;
    sessionId?: string;
  }

  function normalizePercentage(value: number | undefined, fallback = 1) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return fallback;
    }
    const normalized = value / 100;
    if (normalized < 0) return 0;
    if (normalized > 1) return 1;
    return normalized;
  }

  function normalizeRatio(value: number | undefined, fallback = 0) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return fallback;
    }
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  function appendOptionalNumber(
    formData: FormData,
    key: string,
    value?: number | null
  ) {
    if (value === null || value === undefined) return;
    if (!Number.isFinite(value)) return;
    formData.append(key, value.toString());
  }

  function buildFormDataFromParams(params: FilterParams) {
    const toUpload = params.file ?? fileInfo.value?.file;
    if (!toUpload) {
      throw new Error("No file provided for upload");
    }

    if (params.file) {
      setFile(toUpload);
    }

    const snapshot: FilterSnapshot = {
      algorithm: params.algorithm ?? "inductive",
      noiseThreshold: params.noiseThreshold ?? 0,
      variantsCoverage: params.variantsCoverage ?? 100,
      eventCoverage: params.eventCoverage ?? 100,
      caseDurationMin:
        typeof params.caseDurationMin === "number"
          ? params.caseDurationMin
          : null,
      caseDurationMax:
        typeof params.caseDurationMax === "number"
          ? params.caseDurationMax
          : null,
      numberOfEventsMin:
        typeof params.numberOfEventsMin === "number"
          ? params.numberOfEventsMin
          : null,
      numberOfEventsMax:
        typeof params.numberOfEventsMax === "number"
          ? params.numberOfEventsMax
          : null,
    };

    const formData = new FormData();
    formData.append("file", toUpload);
    formData.append("model", snapshot.algorithm);
    formData.append(
      "noise_threshold",
      normalizeRatio(snapshot.noiseThreshold, 0).toString()
    );
    formData.append(
      "variants_coverage",
      normalizePercentage(snapshot.variantsCoverage, 1).toString()
    );
    formData.append(
      "events_coverage",
      normalizePercentage(snapshot.eventCoverage, 1).toString()
    );

    appendOptionalNumber(
      formData,
      "case_duration_min",
      snapshot.caseDurationMin
    );
    appendOptionalNumber(
      formData,
      "case_duration_max",
      snapshot.caseDurationMax
    );
    appendOptionalNumber(
      formData,
      "number_of_events_min",
      snapshot.numberOfEventsMin
    );
    appendOptionalNumber(
      formData,
      "number_of_events_max",
      snapshot.numberOfEventsMax
    );

    return { formData, snapshot };
  }

  function ensureDownloadContext() {
    if (!fileInfo.value?.file) {
      throw new Error("Please upload a file before downloading the model");
    }
  }

  function extractFilename(disposition?: string | null) {
    if (!disposition) return null;
    const filenameMatch =
      /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
    if (!filenameMatch) return null;
    const raw = filenameMatch[1] || filenameMatch[2];
    if (!raw) return null;
    try {
      return decodeURIComponent(raw.trim());
    } catch (e) {
      return raw.trim();
    }
  }

  function triggerBrowserDownload(blob: Blob, filename: string) {
    if (!process.client) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // async function submitRequest(
  //   params: FilterParams,
  //   options: { updateBaseData: boolean }
  // ): Promise<UploadResponse> {
  //   const { formData, snapshot } = buildFormDataFromParams(params);

  //   pending.value = true;
  //   error.value = null;

  //   try {
  //     const res = await $fetch<UploadResponse>("/api/uploads", {
  //       method: "POST",
  //       body: formData,
  //       timeout: 600000,
  //     });
  //     data.value = res.data;
  //     if (options.updateBaseData) {
  //       baseData.value = res.data;
  //     }
  //     lastRequestParams.value = snapshot;
  //     return res;
  //   } catch (err) {
  //     error.value = err;
  //     throw err;
  //   } finally {
  //     pending.value = false;
  //   }
  // }

  async function submitRequest(
    params: Parameter,
    options: { updateBaseData: boolean }
  ): Promise<UploadResponse> {
    const toUpload = params.file ?? fileInfo.value?.file;
    const session_id = useCookie("session_id");
    if (!toUpload) {
      throw new Error("No file provided for upload");
    }
    if (params.file) {
      setFile(toUpload);
    }
    const formData = new FormData();
    const sessionId = calculateSessionId(toUpload);
    formData.append("file", toUpload);
    formData.append("session_id", sessionId);

    pending.value = true;
    error.value = null;

    try {
      const res = await $fetch<UploadResponse>("/api/uploading", {
        method: "POST",
        body: formData,
        timeout: 600000,
      });
      data.value = res.data;
      if (options.updateBaseData) {
        baseData.value = res.data;
      }
      // lastRequestParams.value = snapshot;
      return res;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      pending.value = false;
      session_id.value = sessionId;
    }
  }

  async function downloadModel(overrides: Partial<FilterParams> = {}) {
    // ensureDownloadContext();

    const snapshot = lastRequestParams.value;
    if (!snapshot && !overrides.algorithm) {
      throw new Error(
        "No previous upload context available. Please run discovery before downloading."
      );
    }

    const mergedParams: FilterParams = {
      session_id: overrides.session_id,
      algorithm: overrides.algorithm ?? snapshot?.algorithm,
      noiseThreshold: overrides.noiseThreshold ?? snapshot?.noiseThreshold ?? 0,
      variantsCoverage:
        overrides.variantsCoverage ?? snapshot?.variantsCoverage ?? 100,
      eventCoverage: overrides.eventCoverage ?? snapshot?.eventCoverage ?? 100,
      caseDurationMin:
        overrides.caseDurationMin ?? snapshot?.caseDurationMin ?? undefined,
      caseDurationMax:
        overrides.caseDurationMax ?? snapshot?.caseDurationMax ?? undefined,
      numberOfEventsMin:
        overrides.numberOfEventsMin ?? snapshot?.numberOfEventsMin ?? undefined,
      numberOfEventsMax:
        overrides.numberOfEventsMax ?? snapshot?.numberOfEventsMax ?? undefined,
    };

    // const { formData } = buildFormDataFromParams(mergedParams);
    const payload = {
      session_id: mergedParams.session_id,
      model: mergedParams.algorithm,
      noise_threshold: normalizeRatio(
        mergedParams.noiseThreshold,
        0
      ).toString(),
      variants_coverage: normalizePercentage(
        mergedParams.variantsCoverage,
        1
      ).toString(),
      events_coverage: normalizePercentage(
        mergedParams.eventCoverage,
        1
      ).toString(),
      case_duration_min: mergedParams.caseDurationMin,
      case_duration_max: mergedParams.caseDurationMax,
      number_of_events_min: mergedParams.numberOfEventsMin,
      number_of_events_max: mergedParams.numberOfEventsMax,
    };
    console.log("downloadModel payload:", payload);

    const response = await $fetch.raw("/api/download", {
      method: "POST",
      body: payload,
      timeout: 600000,
      responseType: "blob",
    });

    const blob = (response._data as Blob) ?? new Blob();
    const filename =
      extractFilename(response.headers.get("content-disposition")) ||
      `${mergedParams.algorithm || "model"}.xml`;

    triggerBrowserDownload(blob, filename);

    return { filename };
  }

  // async function upload(
  //   file?: File,
  //   algorithm?: string,
  //   noiseThreshold?: number,
  //   variantsCoverage?: number,
  //   eventCoverage?: number,
  //   caseDurationMin?: number,
  //   caseDurationMax?: number,
  //   numberOfEventsMin?: number,
  //   numberOfEventsMax?: number
  // ): Promise<UploadResponse> {
  //   return submitRequest(
  //     {
  //       file,
  //       algorithm,
  //       noiseThreshold,
  //       variantsCoverage,
  //       eventCoverage,
  //       caseDurationMin,
  //       caseDurationMax,
  //       numberOfEventsMin,
  //       numberOfEventsMax,
  //     },
  //     { updateBaseData: true }
  //   );
  // }

  async function upload(
    file?: File,
    sessionId?: string
  ): Promise<UploadResponse> {
    return submitRequest(
      {
        file,
        sessionId,
      },
      { updateBaseData: true }
    );
  }

  async function applyFilters(
    algorithm?: string,
    noiseThreshold?: number,
    variantsCoverage?: number,
    eventCoverage?: number,
    caseDurationMin?: number,
    caseDurationMax?: number,
    numberOfEventsMin?: number,
    numberOfEventsMax?: number
  ): Promise<UploadResponse> {
    if (!fileInfo.value?.file) {
      throw new Error("Please upload a file before applying filters");
    }

    return submitRequest(
      {
        file: fileInfo.value.file,
        algorithm,
        noiseThreshold,
        variantsCoverage,
        eventCoverage,
        caseDurationMin,
        caseDurationMax,
        numberOfEventsMin,
        numberOfEventsMax,
      },
      { updateBaseData: false }
    );
  }

  return {
    fileInfo,
    setFile,
    clearFile,
    upload,
    applyFilters,
    data,
    baseData,
    pending,
    error,
    downloadModel,
  };
};
