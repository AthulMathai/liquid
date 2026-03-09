"use client";

import { useCallback, useMemo, useState } from "react";
import { findProductByScan } from "@/lib/scanner/findProductByScan";
import type { Product } from "@/types/product";

type ScannerStatus = "idle" | "scanning" | "matched" | "not_found" | "error";

type UseScannerState = {
  scanValue: string;
  status: ScannerStatus;
  product: Product | null;
  error: string | null;
  setScanValue: (value: string) => void;
  runScan: (value?: string) => Promise<void>;
  reset: () => void;
  isBusy: boolean;
};

export function useScanner(initialValue = ""): UseScannerState {
  const [scanValue, setScanValue] = useState(initialValue);
  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setScanValue("");
    setStatus("idle");
    setProduct(null);
    setError(null);
  }, []);

  const runScan = useCallback(
    async (value?: string) => {
      const nextValue = (value ?? scanValue).trim();

      if (!nextValue) {
        setStatus("error");
        setProduct(null);
        setError("Scan value is empty.");
        return;
      }

      try {
        setStatus("scanning");
        setError(null);
        setProduct(null);

        const result = await findProductByScan(nextValue);

        if (result.error || !result.data) {
          setStatus("not_found");
          setProduct(null);
          setError(
            result.error instanceof Error
              ? result.error.message
              : "No product found."
          );
          return;
        }

        setScanValue(result.data.scan.normalizedUpper || nextValue);
        setStatus("matched");
        setProduct(result.data.product as Product);
        setError(null);
      } catch (err) {
        setStatus("error");
        setProduct(null);
        setError(err instanceof Error ? err.message : "Scanner failed.");
      }
    },
    [scanValue]
  );

  const isBusy = useMemo(() => status === "scanning", [status]);

  return {
    scanValue,
    status,
    product,
    error,
    setScanValue,
    runScan,
    reset,
    isBusy,
  };
}

export default useScanner;