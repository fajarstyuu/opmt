const MakeError = (
  message: string,
  code?: number
): Error & { code?: number } => {
  const error = new Error(message) as Error & { code?: number };
  if (code) {
    error.code = code;
  }
  return error;
};

const CheckPayload = (payload: any, requiredFields: string[]): void => {
  for (const field of requiredFields) {
    if (!(field in payload)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required field: ${field}`,
      });
    }
  }
};
export { MakeError, CheckPayload };
