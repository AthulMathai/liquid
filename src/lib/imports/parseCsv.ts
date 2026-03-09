import Papa from "papaparse";

export type ParsedCsvRow = Record<string, string>;

export type ParseCsvSuccess = {
  data: ParsedCsvRow[];
  errors: string[];
  meta: {
    fileName?: string;
    rowCount: number;
    columnCount: number;
    columns: string[];
  };
};

export type ParseCsvResult =
  | { data: ParseCsvSuccess; error: null }
  | { data: null; error: Error };

function normalizeHeader(header: string) {
  return header.trim();
}

function normalizeCellValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function stripBom(value: string) {
  return value.replace(/^\uFEFF/, "");
}

export async function parseCsv(
  file: File | Blob,
  fileName?: string
): Promise<ParseCsvResult> {
  try {
    const text = await file.text();
    const cleanedText = stripBom(text);

    return await new Promise<ParseCsvResult>((resolve) => {
      Papa.parse<Record<string, unknown>>(cleanedText, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: normalizeHeader,
        complete: (results) => {
          const parseErrors = (results.errors ?? []).map((error) => {
            const rowInfo =
              typeof error.row === "number" ? ` at row ${error.row + 1}` : "";
            return `${error.message}${rowInfo}`;
          });

          const columns = Array.isArray(results.meta.fields)
            ? results.meta.fields.map((field) => normalizeHeader(field))
            : [];

          const normalizedRows: ParsedCsvRow[] = (results.data ?? [])
            .map((row) => {
              const normalizedRow: ParsedCsvRow = {};

              for (const column of columns) {
                normalizedRow[column] = normalizeCellValue(row[column]);
              }

              return normalizedRow;
            })
            .filter((row) =>
              Object.values(row).some((value) => value.trim().length > 0)
            );

          resolve({
            data: {
              data: normalizedRows,
              errors: parseErrors,
              meta: {
                fileName,
                rowCount: normalizedRows.length,
                columnCount: columns.length,
                columns,
              },
            },
            error: null,
          });
        },
        error: (error: Error) => {
          resolve({
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        },
      });
    });
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Failed to parse CSV."),
    };
  }
}