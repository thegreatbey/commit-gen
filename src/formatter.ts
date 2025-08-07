export function formatMessage(message: string, useConventional: boolean): string {
  return useConventional ? `feat: ${message}` : message;
}