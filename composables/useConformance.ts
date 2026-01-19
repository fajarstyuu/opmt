// interface ConformanceMetrics {
//   fitness: number;
//   precision: number;
//   generalization: number;
//   simplicity: number;
// }

// interface ConformanceMetricsRes {
//   code: number;
//   message: string;
//   data: any;
// }

// export const useConformance = () => {
//   const conformanceData = useState<ConformanceMetrics | null>(
//     "conformanceData",
//     () => null
//   );

//   const { fileInfo } = useFile();

//   function toNumber(v: any): number {
//     if (v == null) return 0;
//     if (typeof v === "number") return v;
//     if (typeof v === "string") {
//       const n = Number(v);
//       return isNaN(n) ? 0 : n;
//     }
//     // common shape: { average_trace_fitness: number }
//     if (typeof v === "object") {
//       if (v.average_trace_fitness != null)
//         return toNumber(v.average_trace_fitness);
//       if (v.value != null) return toNumber(v.value);
//       // try first numeric prop
//       for (const key of Object.keys(v)) {
//         const nv: number = toNumber((v as any)[key]);
//         if (nv) return nv;
//       }
//     }
//     return 0;
//   }

//   async function startConformance(
//     algorithm?: string,
//     noiseThreshold?: number,
//     variantsCoverage?: number,
//     eventCoverage?: number
//   ): Promise<ConformanceMetricsRes> {
//     const formData = new FormData();
//     const processMiningAlgo = algorithm as string;
//     let noise_threshold = noiseThreshold as number;
//     let variants_coverage = variantsCoverage as number;
//     variants_coverage = variants_coverage / 100;
//     let event_coverage = eventCoverage as number;
//     event_coverage = event_coverage / 100;
//     if (!noise_threshold || noise_threshold < 0 || noise_threshold > 1)
//       noise_threshold = 0;
//     if (
//       variants_coverage == null ||
//       variants_coverage === undefined ||
//       variants_coverage < 0.0 ||
//       variants_coverage > 1.0
//     )
//       variants_coverage = 1.0;
//     if (
//       event_coverage == null ||
//       event_coverage === undefined ||
//       event_coverage < 0.0 ||
//       event_coverage > 1.0
//     )
//       event_coverage = 1.0;
//     formData.append("file", fileInfo.value!.file);
//     formData.append("model", processMiningAlgo);
//     formData.append("noise_threshold", noise_threshold.toString());
//     formData.append("variants_coverage", variants_coverage.toString());
//     formData.append("events_coverage", event_coverage.toString());

//     try {
//       // use $fetch for consistency with other composables
//       const res = await $fetch<ConformanceMetricsRes>("/api/conformance", {
//         method: "POST",
//         body: formData,
//         timeout: 600000,
//       });

//       const payload = res?.data ?? res;

//       conformanceData.value = {
//         fitness: toNumber(payload?.fitness),
//         precision: toNumber(payload?.precision),
//         generalization: toNumber(payload?.generalization),
//         simplicity: toNumber(payload?.simplicity),
//       };

//       return res;
//     } catch (err) {
//       // keep previous value, rethrow so caller can react
//       throw err;
//     }
//   }

//   return {
//     conformanceData,
//     startConformance,
//   };
// };
