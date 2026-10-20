export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Registro inválido recibido del servidor.');
  return value as Record<string, unknown>;
}
export function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error('El catálogo contiene campos obligatorios inválidos.');
  return value;
}
export function optionalText(value: unknown): string | undefined {
  return value == null ? undefined : text(value);
}
export function strings(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) throw new Error('El catálogo contiene una lista inválida.');
  return value;
}
