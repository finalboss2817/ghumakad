
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Core
 * Focused on "Best Optimized Result" via Geographical Clustering.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // STRICT COMPLIANCE: Use named parameter 'apiKey' with 'process.env.API_KEY'.
  // We initialize inside the call to capture the environment state accurately.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Using gemini-3-flash-preview for high performance and compatibility
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Lead Logistics Engineer at Ghumakad. 
    Task: Generate a "Best Optimized Result" itinerary for ${prefs.days} days in ${prefs.destination}.
    
    Travel Persona: ${prefs.type}
    Budget: ${prefs.budget}
    Interests: ${prefs.interests.join(', ')}
    Travel Pace: ${prefs.pace || 'Balanced'}
    
    CRITICAL OPTIMIZATION RULES:
    1. GEOGRAPHICAL CLUSTERING: Group all activities for a single day into the same neighborhood or district.
    2. ROUTE EFFICIENCY: Sequence activities (Morning -> Afternoon -> Evening) to create a linear path without backtracking.
    3. HIDDEN GEMS: Include one "Verified Gem" (hidden local spot) per day located near the main cluster.
    
    Return the plan in clean JSON.`,
    config: {
      systemInstruction: "You are Ghumakad-AI. You are an expert in travel logistics. You prioritize route efficiency over the number of sights. You group attractions by proximity to ensure zero wasted transit time.",
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
                travelTips: { type: Type.STRING, description: "Logistical advice on navigating this specific day's cluster." }
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

  const textOutput = response.text;
  if (!textOutput) throw new Error("Ghumakad Intelligence Sync: No data received.");

  const result = JSON.parse(textOutput);
  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: true
  };
};
