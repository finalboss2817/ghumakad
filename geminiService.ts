
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Core
 * Focused on "Best Optimized Result" via Geographical Clustering.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  // Creating a fresh instance right before call ensures we use the most up-to-date injected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Upgrading to gemini-3-pro-preview for complex reasoning task (logistics optimization)
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are the Lead Logistics Engineer at Ghumakad (Meena Technologies). 
    Task: Generate a "Best Optimized Result" itinerary for ${prefs.days} days in ${prefs.destination}.
    
    Travel Persona: ${prefs.type}
    Budget: ${prefs.budget}
    Interests: ${prefs.interests.join(', ')}
    Travel Pace: ${prefs.pace || 'Balanced'}
    
    OPTIMIZATION MANDATE:
    1. GEOGRAPHICAL CLUSTERING: All activities in a single day MUST be within the same neighborhood or district. 
    2. TRANSIT EFFICIENCY: Sequence activities (Morning -> Afternoon -> Evening) to form a logical, one-way travel path.
    3. HIDDEN GEMS: Include one "Ghumakad Gem" per day that is within 15 minutes of the main highlights.
    
    Output the plan in clean JSON format.`,
    config: {
      systemInstruction: "You are Ghumakad-AI. You prioritize route efficiency over quantity. You never suggest activities that are more than 45 minutes apart in a single day block. Your output is practical, realistic, and logistically sound.",
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
                travelTips: { type: Type.STRING, description: "Geographical optimization tip or hidden Gem nearby" }
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

  // response.text is a property, not a method
  const textOutput = response.text;
  if (!textOutput) throw new Error("Ghumakad Sync Error: Empty response from masterframe.");

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
    console.error("JSON Parsing Error from Ghumakad Intel:", err);
    throw new Error("Ghumakad Sync Error: Intelligence core returned unparseable data.");
  }
};
