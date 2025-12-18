// src/utils/price-utils.ts
export function normalizePrice(text: string): number {
  // ambil hanya digit
  const digits = text.replace(/[^\d]/g, '');
  return Number(digits);
}
