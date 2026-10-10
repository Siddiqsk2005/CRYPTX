export type ThreatClassification = "safe" | "suspicious" | "dangerous";
export type RiskLevel = "Low" | "Medium" | "High";
export type AnalysisSource = "flask" | "supabase" | "local";

export type AnalysisResult = {
  id?: string;
  input: string;
  threatScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  classification: ThreatClassification;
  confidence: number;
  explanation: string;
  trustIndicators: string[];
  riskIndicators: string[];
  recommendedAction: string;
  category: string;
  source: AnalysisSource;
  createdAt?: string;
};

export type AnalyzeThreatResponse = {
  threat_score: number;
  risk_level: RiskLevel;
  explanation: string;
  signals?: string[];
  input_type?: "text" | "url";
};

export type StoredScanRecord = {
  id: string;
  userId: string | null;
  input: string;
  threatScore: number;
  riskLevel: RiskLevel;
  classification: ThreatClassification;
  explanation: string;
  source: AnalysisSource;
  createdAt: string;
};

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 70) {
    return "High";
  }

  if (score >= 35) {
    return "Medium";
  }

  return "Low";
}

export function riskLevelToClassification(riskLevel: RiskLevel): ThreatClassification {
  if (riskLevel === "High") {
    return "dangerous";
  }

  if (riskLevel === "Medium") {
    return "suspicious";
  }

  return "safe";
}

export function classificationToRiskLevel(classification: ThreatClassification): RiskLevel {
  if (classification === "dangerous") {
    return "High";
  }

  if (classification === "suspicious") {
    return "Medium";
  }

  return "Low";
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function inferCategory(input: string) {
  try {
    const value = input.trim();
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);

    if (parsed.hostname) {
      return "URL";
    }
  } catch {
    return "Message";
  }

  return "Message";
}

function buildConfidence(score: number, signalCount: number) {
  return Math.min(98, Math.max(62, clampScore(score * 0.45 + signalCount * 8 + 40)));
}

function buildRecommendedAction(riskLevel: RiskLevel) {
  if (riskLevel === "High") {
    return "Do not click, reply, or share credentials. Verify the source through an official channel before taking any action.";
  }

  if (riskLevel === "Medium") {
    return "Pause before responding and verify the sender or domain independently.";
  }

  return "This looks low risk, but continue to use normal caution before sharing sensitive information.";
}

function buildTrustIndicators(score: number, signals: string[]) {
  if (score >= 35) {
    return [];
  }

  const indicators = [
    "No strong urgency or intimidation language was detected.",
    "The content does not strongly resemble common phishing or payment scams.",
  ];

  if (signals.length === 0) {
    indicators.push("The AI analyzer did not detect strong threat patterns in the content.");
  }

  return indicators;
}

function buildRiskIndicators(score: number, signals: string[]) {
  const indicators = signals.map((signal) => `${signal}`);

  if (score >= 70) {
    indicators.push("The content shows multiple scam or phishing signals.");
  } else if (score >= 35) {
    indicators.push("The content includes suspicious wording or link patterns.");
  }

  return indicators;
}

export function mapFlaskResult(input: string, payload: AnalyzeThreatResponse): AnalysisResult {
  const threatScore = clampScore(payload.threat_score);
  const riskLevel = payload.risk_level ?? scoreToRiskLevel(threatScore);
  const signals = payload.signals ?? [];

  return {
    input,
    threatScore,
    riskScore: threatScore,
    riskLevel,
    classification: riskLevelToClassification(riskLevel),
    confidence: buildConfidence(threatScore, signals.length),
    explanation: payload.explanation,
    trustIndicators: buildTrustIndicators(threatScore, signals),
    riskIndicators: buildRiskIndicators(threatScore, signals),
    recommendedAction: buildRecommendedAction(riskLevel),
    category: payload.input_type === "url" ? "URL" : inferCategory(input),
    source: "flask",
  };
}

type SupabaseFunctionPayload = {
  classification: ThreatClassification;
  riskScore?: number;
  confidence?: number;
  explanation?: string;
  trustIndicators?: string[];
  riskIndicators?: string[];
  recommendedAction?: string;
  category?: string;
};

export function mapSupabaseResult(input: string, payload: SupabaseFunctionPayload): AnalysisResult {
  const threatScore = clampScore(payload.riskScore ?? 50);
  const riskLevel = classificationToRiskLevel(payload.classification);

  return {
    input,
    threatScore,
    riskScore: threatScore,
    riskLevel,
    classification: payload.classification,
    confidence: clampScore(payload.confidence ?? 70),
    explanation: payload.explanation ?? "The fallback analyzer produced a limited result.",
    trustIndicators: payload.trustIndicators ?? [],
    riskIndicators: payload.riskIndicators ?? [],
    recommendedAction: payload.recommendedAction ?? buildRecommendedAction(riskLevel),
    category: payload.category ?? inferCategory(input),
    source: "supabase",
  };
}
