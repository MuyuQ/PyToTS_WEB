export function normalizeDualCodeInput(input: { python: string; typescript: string }) {
  if (!input.python.trim()) throw new Error("python block is required");
  if (!input.typescript.trim()) throw new Error("typescript block is required");
  return input;
}