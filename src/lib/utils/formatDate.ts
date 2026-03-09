type FormatDateOptions = {
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  includeTime?: boolean;
};

export function formatDate(
  value: string | number | Date | null | undefined,
  options: FormatDateOptions = {}
) {
  if (!value) return "—";

  const {
    locale = "en-CA",
    dateStyle = "medium",
    timeStyle = "short",
    includeTime = false,
  } = options;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    ...(includeTime ? { timeStyle } : {}),
  }).format(date);
}

export default formatDate;