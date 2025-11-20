<template>
  <section
    class="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-16 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"
  >
    <div class="w-full max-w-5xl">
      <!-- Header with Upload Widget -->
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-8 mb-8"
      >
        <div class="text-left space-y-3 flex-1">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
            Online Process Mining Tools
          </h1>
          <p class="text-gray-700 text-sm md:text-base">
            Analisis log proses Anda secara mudah dan cepat — unggah dataset CSV
            atau XES.
          </p>
        </div>

        <div class="flex-shrink-0">
          <div
            :class="[
              'w-80 max-w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 cursor-pointer transition-all duration-200',
              dragOver
                ? 'border-dashed border-indigo-400 bg-indigo-50/50 scale-105'
                : 'border-dashed border-gray-300 hover:border-indigo-300',
            ]"
            @drop.prevent="onDrop"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @click="openFilePicker"
          >
            <input
              ref="inputRef"
              type="file"
              accept=".csv,.xes,.xes.gz"
              class="hidden"
              @change="handleFiles($event.target.files)"
            />

            <div class="flex items-center gap-3">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-700"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3v12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7 10l5-5 5 5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div class="flex-1">
                <div class="text-sm font-medium">
                  Seret file CSV / XES di sini
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Atau klik untuk memilih file dari perangkat
                </div>
              </div>
            </div>

            <div class="mt-3 text-xs text-gray-400">
              Maks 10 MB • .csv, .xes
            </div>

            <div
              v-if="error"
              class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded"
            >
              {{ error }}
            </div>

            <div
              v-if="fileInfo"
              class="mt-2 rounded-md border p-2 bg-gray-50 text-xs"
            >
              <div class="flex items-center justify-between">
                <div class="truncate flex-1">
                  <div class="font-medium">{{ fileInfo.name }}</div>
                  <div class="text-gray-500 text-[11px]">
                    {{ (fileInfo.size / 1024).toFixed(1) }} KB
                  </div>
                </div>
                <div class="ml-2">
                  <button
                    v-if="!uploading"
                    @click.stop="clearFile"
                    class="text-[11px] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Hapus
                  </button>
                  <div
                    v-else
                    class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full bg-indigo-400 animate-pulse transition-all"
                      style="width: 60%"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-2">
              <button
                @click.stop="openFilePicker"
                class="flex-1 text-xs font-medium py-2 rounded-md border hover:bg-gray-50 transition-colors"
              >
                Pilih file
              </button>
              <button
                @click.stop="uploadFile"
                :disabled="!fileInfo || uploading"
                class="text-xs font-medium py-2 px-3 rounded-md bg-indigo-600 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                {{ uploading ? "Mengirim..." : "Upload" }}
              </button>
            </div>

            <div class="mt-3 text-[11px] text-gray-400">
              💡 Tip: gunakan dataset kecil untuk uji coba.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Use a minimal/plain layout for the index page
definePageMeta({ layout: "plain" });
import { useFile } from "~/composables/useFile";

const emit = defineEmits(["upload"]);

const dragOver = ref(false);
const inputRef = ref(null);
const fileInfo = ref(null);
const error = ref("");
const uploading = ref(false);

const {
  upload,
  data,
  pending: uploadPending,
  error: uploadError,
  fileInfo: uploadFileInfo,
} = useFile();

function openFilePicker() {
  inputRef.value?.click();
}

function isAccepted(filename) {
  if (!filename) return false;
  const lower = filename.toLowerCase();
  return [".csv", ".xes", ".xes.gz"].some((ext) => lower.endsWith(ext));
}

function handleFiles(files) {
  error.value = "";
  const file = files?.[0];
  if (!file) return;

  if (!isAccepted(file.name)) {
    error.value = "Hanya file .csv atau .xes yang diperbolehkan.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    error.value = "Ukuran file maksimal 10 MB.";
    return;
  }

  fileInfo.value = { file, name: file.name, size: file.size };
}

function clearFile() {
  fileInfo.value = null;
  error.value = "";
  if (inputRef.value) inputRef.value.value = null;
}

function uploadFile() {
  if (!fileInfo.value?.file) {
    error.value = "Belum ada file untuk di-upload.";
    return;
  }
  uploading.value = true;
  error.value = "";

  upload(fileInfo.value.file)
    .then((res) => {
      emit("upload", fileInfo.value.file);
      navigateTo("/discovery");
    })
    .catch((err) => {
      console.error("upload error:", err);
      error.value = (err && err.message) || "Upload gagal.";
    });
}

function onDrop(e) {
  dragOver.value = false;
  const dt = e.dataTransfer;
  if (dt?.files) handleFiles(dt.files);
}
</script>

<style scoped>
/* Tambahan style jika diperlukan */
</style>
