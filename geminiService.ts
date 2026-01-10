
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Core
 * Focused on "Best Optimized Result" via Geographical Clustering.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // STRICT REQUIREMENT: Initializing AI with named parameter apiKey from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Lead Logistics Engineer at Ghumakad (Meena Technologies). 
    Task: Generate a highly "Practical" and "Logistically Optimized" itinerary for ${prefs.days} days in ${prefs.destination}.
    
    Travel Persona: ${prefs.type}
    Budget: ${prefs.budget}
    Interests: ${prefs.interests.join(', ')}
    Travel Pace: ${prefs.pace || 'Balanced'}
    
    CORE OPTIMIZATION RULES:
    1. GEOGRAPHICAL CLUSTERING: Ensure Day 1 activities are in one neighborhood, Day 2 in another nearby area, etc. 
    2. MINIMIZE COMMUTE: Sequence (Morning -> Afternoon -> Evening) to ensure a smooth, one-way path without backtracking.
    3. REALISTIC BUFFERS: If pace is 'Relaxed', include more rest. If 'Fast', maximize sights but keep them physically close.
    4. GHUMAKAD GEMS: Include 1 hyper-local hidden spot per day that is within walking distance of the main highlights.
    
    Return the result as clean JSON.`,
    config: {
      systemInstruction: "You are Ghumakad-AI. You prioritize route efficiency. You never suggest places that require cross-city travel in a single afternoon block. You are precise, practical, and verified.",
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
                travelTips: { type: Type.STRING, description: "Logistical advice or hidden Gem nearby" }
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
  if (!textOutput) throw new Error("Ghumakad Sync Error: No data received.");

  const result = JSON.parse(textOutput);
  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: true
  };
};
