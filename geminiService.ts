
import { supabase } from "./supabaseClient";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence Core - Server Proxy
 * Now routes through Supabase Edge Functions to utilize secrets securely.
 * Expected Edge Function Name: 'generate-itinerary'
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-itinerary', {
      body: { 
        prefs,
        // The edge function will use its own internal environment variable for the Gemini Key
      }
    });

    if (error) {
      console.error("Supabase Edge Function Error:", error);
      throw new Error(`Ghumakad Intel Sync Error: ${error.message || 'Server communication failed'}`);
    }

    if (!data) {
      throw new Error("Ghumakad Intelligence Sync: No data received from edge server.");
    }

    // Assuming the Edge Function returns the formatted itinerary object
    return {
      ...data,
      id: data.id || Math.random().toString(36).substr(2, 9),
      createdAt: data.createdAt || new Date().toISOString(),
      is_verified: true
    };
  } catch (err: any) {
    console.error("Ghumakad Service Error:", err);
    throw err;
  }
};
