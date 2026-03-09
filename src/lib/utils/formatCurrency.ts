type FormatCurrencyOptions = {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  value: number | string | null | undefined,
  options: FormatCurrencyOptions = {}
) {
  const {
    currency = "CAD",
    locale = "en-CA",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const numericValue =
    typeof value === "number" ? value : Number(value ?? 0);

  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(safeValue);
}

export default formatCurrency;