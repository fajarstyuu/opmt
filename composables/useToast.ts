interface ToastState {
  show: boolean;
  type: "success" | "error";
  message: string;
}

const toastState = reactive<ToastState>({
  show: false,
  type: "success",
  message: "",
});

export function useToast() {
  function success(message: string) {
    toastState.type = "success";
    toastState.message = message;
    toastState.show = true;
  }

  function error(message: string) {
    toastState.type = "error";
    toastState.message = message;
    toastState.show = true;
  }

  return {
    toastState,
    success,
    error,
  };
}
