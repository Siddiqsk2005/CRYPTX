import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisResult {
  classification: "safe" | "suspicious" | "dangerous";
  riskScore: number;
  confidence: number;
  explanation: string;
  trustIndicators: string[];
  riskIndicators: string[];
  recommendedAction: string;
  category: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Sentinel AI, an advanced cybersecurity threat analysis agent. Your role is to analyze messages and determine if they are legitimate/useful or potentially harmful.

CRITICAL: You must accurately classify messages. Many messages are LEGITIMATE and should NOT be flagged as threats.

CLASSIFICATION RULES:
1. SAFE/USEFUL (Risk Score 0-30):
   - OTPs and verification codes from banks, services
   - Delivery notifications from legitimate services
   - Personal messages from known contacts
   - Bank alerts about transactions
   - Appointment reminders
   - Genuine promotional offers from verified businesses

2. SUSPICIOUS (Risk Score 31-70):
   - Messages with unclear sender identity
   - Mild urgency without clear threat
   - Unknown sender patterns
   - Unusual requests that aren't clearly malicious

3. DANGEROUS (Risk Score 71-100):
   - Requests for immediate payment to unknown parties
   - Phishing attempts with fake links
   - Impersonation of officials demanding money
   - Job scams requiring upfront payment
   - Lottery/prize scams
   - Romance scams asking for money
   - Fake tech support messages

ANALYSIS REQUIREMENTS:
- Explain your reasoning clearly
- List specific trust indicators OR risk indicators
- Provide actionable recommendations
- Never flag legitimate OTPs, bank alerts, or personal messages as dangerous

Respond ONLY with valid JSON in this exact format:
{
  "classification": "safe" | "suspicious" | "dangerous",
  "riskScore": <number 0-100>,
  "confidence": <number 0-100>,
  "explanation": "<detailed explanation of why this classification was made>",
  "trustIndicators": ["<list of factors that make this message trustworthy>"],
  "riskIndicators": ["<list of factors that make this message risky>"],
  "recommendedAction": "<what the user should do>",
  "category": "<message type: OTP, Bank Alert, Delivery, Personal, Promotional, Job Offer, Unknown>"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this message for threats:\n\n"${message}"` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI model");
    }

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Provide a fallback analysis
      analysisResult = {
        classification: "suspicious",
        riskScore: 50,
        confidence: 30,
        explanation: "Unable to fully analyze the message. Please review manually.",
        trustIndicators: [],
        riskIndicators: ["Analysis incomplete"],
        recommendedAction: "Exercise caution and verify the sender through official channels.",
        category: "Unknown"
      };
    }

    // Validate and normalize the response
    const validClassifications = ["safe", "suspicious", "dangerous"];
    if (!validClassifications.includes(analysisResult.classification)) {
      analysisResult.classification = "suspicious";
    }

    analysisResult.riskScore = Math.max(0, Math.min(100, analysisResult.riskScore || 50));
    analysisResult.confidence = Math.max(0, Math.min(100, analysisResult.confidence || 50));

    console.log("Analysis complete:", {
      classification: analysisResult.classification,
      riskScore: analysisResult.riskScore,
      category: analysisResult.category
    });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-threat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        classification: "suspicious",
        riskScore: 50,
        confidence: 0,
        explanation: "An error occurred during analysis. Please try again.",
        trustIndicators: [],
        riskIndicators: ["Analysis failed"],
        recommendedAction: "Try again or review the message manually.",
        category: "Error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
