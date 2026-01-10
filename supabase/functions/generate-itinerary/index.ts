import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@1.35.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Ghumakad Intelligence - Edge Logic
 * This function processes travel requests securely on the server.
 * It uses neighborhood-based clustering to minimize travel time.
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prefs } = await req.json();

    if (!prefs) {
      throw new Error("Missing traveler preferences.");
    }

    // Initialize Gemini with the server-side API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Generate high-quality itinerary with Gemini 3 Pro
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Plan a ${prefs.days}-day trip to ${prefs.destination} for a ${prefs.type} traveler. 
      Budget: ${prefs.budget}. 
      Interests: ${prefs.interests.join(", ")}. 
      Pace: ${prefs.pace || 'Balanced'}.`,
      config: {
        systemInstruction: `You are the Lead Travel Architect for Ghumakad. 
        Your goal is to create a realistic, geographically optimized itinerary.
        
        RULES:
        1. Group activities by proximity. Do not cross the city multiple times a day.
        2. Provide 3 neighborhood-specific food/dining recommendations per day.
        3. Include one "Ghumakad Gem" (a verified hidden spot) per day.
        4. Return ONLY a structured JSON object.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            totalDays: { type: Type.NUMBER },
            travelType: { type: Type.STRING },
            budget: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  morning: { type: Type.STRING },
                  afternoon: { type: Type.STRING },
                  evening: { type: Type.STRING },
                  food: { type: Type.ARRAY, items: { type: Type.STRING } },
                  travelTips: { type: Type.STRING }
                },
                required: ["day", "morning", "afternoon", "evening", "food", "travelTips"]
              }
            },
            mustKnowTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["destination", "totalDays", "travelType", "budget", "days", "mustKnowTips", "commonMistakes"]
        }
      }
    });

    return new Response(response.text, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err: any) {
    console.error("Ghumakad Intelligence Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});