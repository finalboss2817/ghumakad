
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Core
 * Focused on "Best Optimized Result" via Geographical Clustering.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // Initialize with the named parameter 'apiKey' using process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use gemini-3-flash-preview for high speed and reliability
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the Lead Logistics Engineer at Ghumakad (Meena Technologies). 
    Task: Generate a "Best Optimized Result" itinerary for ${prefs.days} days in ${prefs.destination}.
    
    Travel Persona: ${prefs.type}
    Budget: ${prefs.budget}
    Interests: ${prefs.interests.join(', ')}
    Travel Pace: ${prefs.pace || 'Balanced'}
    
    CRITICAL OPTIMIZATION RULES:
    1. GEOGRAPHICAL CLUSTERING: All activities suggested for a single day MUST be physically located within the same neighborhood or district.
    2. ROUTE EFFICIENCY: Sequence activities (Morning -> Afternoon -> Evening) to create a linear path, eliminating any "back-and-forth" travel.
    3. PRACTICAL BUFFERS: Include realistic travel times based on the ${prefs.pace} pace.
    4. GHUMAKAD GEMS: Include one "Verified Gem" (hidden spot) per day that is within 15 minutes of the main activities.
    
    Output the plan in clean JSON format.`,
    config: {
      systemInstruction: "You are Ghumakad-AI, a specialist in hyper-efficient travel logistics. Your itineraries are famous for their perfect pacing and logical flow. You prioritize route efficiency over the number of sights. If places are more than 30 minutes apart, they should not be in the same half-day block.",
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
                travelTips: { type: Type.STRING, description: "Logistical advice on how to navigate this specific day's cluster." }
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

  try {
    const result = JSON.parse(textOutput);
    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      interests: prefs.interests,
      createdAt: new Date().toISOString(),
      is_verified: true
    };
  } catch (err) {
    console.error("JSON Parsing Error:", err);
    throw new Error("Ghumakad Intelligence Error: Could not process AI response.");
  }
};
