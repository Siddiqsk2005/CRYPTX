import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import type { AnalysisResult, StoredScanRecord } from "@/lib/analysis";

const LOCAL_SCAN_KEY = "sentinel-ai-pro:scan-history";

type LocalScanBucket = Record<string, StoredScanRecord[]>;
type ScanHistoryRow = Tables<"scan_history">;

function getBucketKey(userId?: string | null) {
  return userId ?? "guest";
}

function safeReadBucket(): LocalScanBucket {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_SCAN_KEY);
    return raw ? (JSON.parse(raw) as LocalScanBucket) : {};
  } catch {
    return {};
  }
}

function writeBucket(bucket: LocalScanBucket) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_SCAN_KEY, JSON.stringify(bucket));
}

function mapRowToStoredRecord(row: ScanHistoryRow): StoredScanRecord {
  return {
    id: row.id,
    userId: row.user_id,
    input: row.input_text,
    threatScore: row.threat_score,
    riskLevel: row.risk_level,
    classification: row.classification,
    explanation: row.explanation,
    source: row.source,
    createdAt: row.created_at,
  };
}

function toLocalRecord(userId: string | null | undefined, result: AnalysisResult): StoredScanRecord {
  return {
    id: result.id ?? crypto.randomUUID(),
    userId: userId ?? null,
    input: result.input,
    threatScore: result.threatScore,
    riskLevel: result.riskLevel,
    classification: result.classification,
    explanation: result.explanation,
    source: result.source,
    createdAt: result.createdAt ?? new Date().toISOString(),
  };
}

function saveLocalRecord(userId: string | null | undefined, result: AnalysisResult) {
  const bucket = safeReadBucket();
  const key = getBucketKey(userId);
  const nextRecord = toLocalRecord(userId, result);
  const nextItems = [nextRecord, ...(bucket[key] ?? [])].slice(0, 50);

  writeBucket({
    ...bucket,
    [key]: nextItems,
  });

  return nextRecord;
}

function readLocalRecords(userId?: string | null) {
  const bucket = safeReadBucket();
  return bucket[getBucketKey(userId)] ?? [];
}

function clearLocalRecords(userId?: string | null) {
  const bucket = safeReadBucket();
  const key = getBucketKey(userId);

  if (!(key in bucket)) {
    return;
  }

  const nextBucket = { ...bucket };
  delete nextBucket[key];
  writeBucket(nextBucket);
}

export async function saveScanResult(userId: string | null | undefined, result: AnalysisResult) {
  if (!userId) {
    return {
      storage: "local" as const,
      record: saveLocalRecord(null, result),
    };
  }

  const payload: TablesInsert<"scan_history"> = {
    user_id: userId,
    input_text: result.input,
    threat_score: result.threatScore,
    risk_level: result.riskLevel,
    classification: result.classification,
    explanation: result.explanation,
    source: result.source,
  };

  try {
    const { data, error } = await supabase.from("scan_history").insert(payload).select().single();

    if (error) {
      throw error;
    }

    return {
      storage: "supabase" as const,
      record: mapRowToStoredRecord(data),
    };
  } catch {
    return {
      storage: "local" as const,
      record: saveLocalRecord(userId, result),
    };
  }
}

export async function fetchScanHistory(userId?: string | null, limit = 20) {
  const localRecords = readLocalRecords(userId);

  if (!userId) {
    return {
      storage: "local" as const,
      records: localRecords.slice(0, limit),
    };
  }

  try {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    const mergedRecords = [...(data ?? []).map(mapRowToStoredRecord), ...localRecords]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, limit);

    return {
      storage: "supabase" as const,
      records: mergedRecords,
    };
  } catch {
    return {
      storage: "local" as const,
      records: localRecords.slice(0, limit),
    };
  }
}

export async function clearScanHistory(userId?: string | null) {
  clearLocalRecords(userId);

  if (!userId) {
    return {
      storage: "local" as const,
    };
  }

  try {
    const { error } = await supabase.from("scan_history").delete().eq("user_id", userId);

    if (error) {
      throw error;
    }

    return {
      storage: "supabase" as const,
    };
  } catch {
    return {
      storage: "local" as const,
    };
  }
}
