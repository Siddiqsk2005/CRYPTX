import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { mapFlaskResult, mapSupabaseResult, type AnalysisResult } from "@/lib/analysis";
import { saveScanResult } from "@/lib/scan-history";

const FLASK_API_URL = (import.meta.env.VITE_FLASK_API_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");
const FLASK_HEALTHCHECK_WINDOW_MS = 30_000;
const FLASK_REQUEST_TIMEOUT_MS = 8_000;

let flaskAvailability: boolean | null = null;
let lastFlaskHealthcheckAt = 0;

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = FLASK_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

async function isFlaskAvailable() {
  const now = Date.now();

  if (flaskAvailability !== null && now - lastFlaskHealthcheckAt < FLASK_HEALTHCHECK_WINDOW_MS) {
    return flaskAvailability;
  }

  lastFlaskHealthcheckAt = now;

  try {
    const response = await fetchWithTimeout(`${FLASK_API_URL}/health`, {
      method: "GET",
    }, 2_500);

    flaskAvailability = response.ok;
    return flaskAvailability;
  } catch {
    flaskAvailability = false;
    return false;
  }
}

async function analyzeWithFlask(input: string) {
  const response = await fetchWithTimeout(`${FLASK_API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    flaskAvailability = false;
    throw new Error(payload.error ?? `Flask backend request failed with status ${response.status}.`);
  }

  flaskAvailability = true;
  return mapFlaskResult(input, payload);
}

async function analyzeWithSupabaseFallback(input: string) {
  const { data, error } = await supabase.functions.invoke("analyze-threat", {
    body: { message: input },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.error && !data?.classification) {
    throw new Error(data.error);
  }

  return mapSupabaseResult(input, data);
}

export function useAnalyzeThreat() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Please enter some text or a URL to analyze.");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let nextResult: AnalysisResult;
      let usedFallback = false;

      if (await isFlaskAvailable()) {
        try {
          nextResult = await analyzeWithFlask(trimmedMessage);
        } catch {
          usedFallback = true;
          nextResult = await analyzeWithSupabaseFallback(trimmedMessage);
        }
      } else {
        usedFallback = true;
        nextResult = await analyzeWithSupabaseFallback(trimmedMessage);
      }

      setIsAnalyzing(false);
      setResult(nextResult);

      try {
        const saveOutcome = await saveScanResult(user?.id, nextResult);
        await queryClient.invalidateQueries({ queryKey: ["scan-history"] });

        if (saveOutcome.storage === "supabase") {
          toast.success("Analysis saved to your dashboard.");
        } else if (user?.id) {
          toast.info("Analysis saved to the local history for this user.");
        } else if (!usedFallback) {
          toast.info("Analysis saved locally in this browser for the current profile.");
        }
      } catch {
        toast.error("Analysis completed, but saving the result failed.");
      }

      return nextResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze the input.";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, isAnalyzing, result, error, reset };
}

export default useAnalyzeThreat;
