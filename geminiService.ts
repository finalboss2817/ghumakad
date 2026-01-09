
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Sync
 * Generates highly optimized, geographically clustered travel itineraries.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // STRICT REQUIREMENT: Initializing AI with named parameter apiKey from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Lead Logistics Engineer at Ghumakad (a Meena Technologies company). 
    Your mission is to generate the "Best Optimized Result" for a ${prefs.days}-day trip to ${prefs.destination}.
    
    Travel Details:
    - Persona: ${prefs.type}
    - Budget Level: ${prefs.budget}
    - Interests: ${prefs.interests.join(', ')}
    
    OPTIMIZATION PROTOCOLS:
    1. GEOGRAPHICAL CLUSTERING: Group all locations for Day 1, Day 2, etc., based on their physical proximity. 
    2. ROUTE EFFICIENCY: Sequence activities (Morning -> Afternoon -> Evening) to create a linear path, minimizing back-and-forth travel.
    3. GHUMAKAD GEMS: Include one "Verified Gem" (hidden spot) per day that is within 15 minutes of the main activities.
    4. BUFFER TIME: Ensure the schedule is realistic (no more than 3 major locations per day).
    
    OUTPUT: Valid JSON based on the provided schema.`,
    config: {
      systemInstruction: "You are Ghumakad-AI, a specialist in hyper-efficient travel logistics. Your itineraries are famous for their perfect pacing and logical flow. Never suggest places that are more than 45 minutes apart in a single half-day block.",
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
                morning: { type: Type.STRING, description: "Geographically starting point of the day" },
                afternoon: { type: Type.STRING, description: "Mid-day activity near the morning location" },
                evening: { type: Type.STRING, description: "Closing activity near the afternoon location" },
                food: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Localized food suggestions for that area" },
                travelTips: { type: Type.STRING, description: "A logistical secret or hidden 'Ghumakad Gem' relevant to this day's area." }
              },
              required: ["day", "morning", "afternoon", "evening", "food", "travelTips"]
            }
          },
          mustKnowTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Essential survival tips for this specific destination" },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Mistakes tourists make that 'Ghumakads' avoid" }
        },
        required: ["destination", "totalDays", "travelType", "budget", "days", "mustKnowTips", "commonMistakes"]
      }
    }
  });

  const textOutput = response.text;
  if (!textOutput) {
    throw new Error("Ghumakad Intelligence failed to sync. Empty response.");
  }

  const result = JSON.parse(textOutput);
  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: true
  };
};
