
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // STRICT REQUIREMENT: Must use this exact initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan a highly optimized ${prefs.days}-day trip to ${prefs.destination} for ${prefs.type} on a ${prefs.budget} budget. 
    Interests: ${prefs.interests.join(', ')}.
    
    OPTIMIZATION RULES:
    1. Geographically cluster all activities for each day to minimize commute time.
    2. Sequence: Morning -> Afternoon -> Evening should follow a logical physical path.
    3. Include local secrets ("Ghumakad Gems") that are near the main attractions.
    4. Provide the result in a clean JSON format.`,
    config: {
      systemInstruction: `You are Ghumakad-AI, a world-class travel planner focusing on "Efficient Exploration". 
      Your goal is to provide the most logistically sound itinerary possible. 
      Ensure total travel time between morning and evening spots is under 90 minutes.`,
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
                travelTips: { type: Type.STRING, description: "Include a logistical tip or a Ghumakad Gem here." }
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

  const text = response.text;
  if (!text) throw new Error("Ghumakad Intelligence returned an empty response.");
  
  const result = JSON.parse(text);
  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: true
  };
};
