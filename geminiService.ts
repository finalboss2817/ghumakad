import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // Always use the prescribed initialization format with process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan a ${prefs.days}-day trip to ${prefs.destination} for ${prefs.type} on a ${prefs.budget} budget. Interests: ${prefs.interests.join(', ')}.`,
    config: {
      systemInstruction: `You are the lead travel expert at Ghumakad. 
      USP: Include "Ghumakad Gems" - these are hidden spots or local secrets that only deep travelers know.
      Provide a highly realistic itinerary in JSON format.
      Highlight specific local food stalls or unique transit methods.`,
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
                travelTips: { type: Type.STRING, description: "Include one local Ghumakad Gem here." }
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

  /* response.text is a getter property, not a method. Access it directly. */
  const result = JSON.parse(response.text);
  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: false // Initially AI generated
  };
};