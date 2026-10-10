import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ROOT_ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ROOT_ENV_PATH)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY", "")
ANALYZE_FUNCTION_URL = f"{SUPABASE_URL}/functions/v1/analyze-threat" if SUPABASE_URL else ""


def clamp_score(score: int) -> int:
    return max(0, min(100, score))


def classification_to_risk_level(classification: str, score: int) -> str:
    normalized = (classification or "").strip().lower()

    if normalized == "dangerous":
        return "High"
    if normalized == "suspicious":
        return "Medium"
    if normalized == "safe":
        return "Low"

    if score >= 70:
        return "High"
    if score >= 35:
        return "Medium"
    return "Low"


def normalize_ai_payload(input_text: str, ai_payload: dict) -> dict:
    score = clamp_score(int(ai_payload.get("riskScore", 50)))
    classification = ai_payload.get("classification", "")
    risk_level = classification_to_risk_level(classification, score)

    signals = ai_payload.get("riskIndicators") or ai_payload.get("trustIndicators") or []
    if not isinstance(signals, list):
        signals = []

    return {
        "threat_score": score,
        "risk_level": risk_level,
        "explanation": ai_payload.get("explanation")
        or "The AI analyzer completed the request, but did not provide a detailed explanation.",
        "signals": signals,
        "input_type": "url" if input_text.strip().startswith(("http://", "https://", "www.")) else "text",
    }


@app.get("/health")
def health_check():
    return jsonify({"status": "ok"})


@app.post("/analyze")
def analyze():
    payload = request.get_json(silent=True) or {}
    raw_input = (payload.get("input") or payload.get("text") or payload.get("url") or "").strip()

    if not raw_input:
        return jsonify({"error": "A text or URL input is required."}), 400

    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return jsonify({"error": "Supabase project configuration is missing from the local environment."}), 500

    try:
        response = requests.post(
            ANALYZE_FUNCTION_URL,
            headers={
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            },
            json={"message": raw_input},
            timeout=45,
        )
    except requests.RequestException as exc:
        return jsonify({"error": f"Unable to reach the AI analyzer service: {exc}"}), 502

    try:
        ai_payload = response.json()
    except ValueError:
        return jsonify({"error": "The AI analyzer returned an invalid response."}), 502

    if not response.ok:
        return jsonify({"error": ai_payload.get("error", "The AI analyzer request failed.")}), response.status_code

    return jsonify(normalize_ai_payload(raw_input, ai_payload))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
