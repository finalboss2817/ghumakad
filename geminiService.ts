
import { supabase } from "./supabaseClient";
import { TravelPreferences, Itinerary } from "./types";

/**
 * Ghumakad Intelligence - Secure Server Proxy
 * 
 * This service routes all travel planning requests to your Supabase Edge Function.
 * This prevents "Missing API Key" errors in the browser and keeps your 
 * Gemini API Key secure on the server.
 */
export const generateItinerary = async (prefs: TravelPreferences): Promise<Itinerary> => {
  console.log("Ghumakad Intelligence: Calling secure Edge Function...");
  
  // We call the 'generate-itinerary' function you've deployed in Supabase.
  // It will use the GEMINI_API_KEY stored in Supabase Secrets.
  const { data, error } = await supabase.functions.invoke('generate-itinerary', {
    body: { prefs }
  });

  if (error) {
    console.error("Ghumakad Sync Failure:", error);
    
    // Detailed error handling for the Edge Function call
    if (error.message?.includes("Failed to fetch")) {
      throw new Error("CORS or Network Error: Ensure your Edge Function handles OPTIONS requests and is deployed.");
    }
    
    throw new Error(`Intelligence Sync Error: ${error.message || 'Server unreachable'}`);
  }

  if (!data) {
    throw new Error("Intelligence Sync Error: Edge Function returned an empty response.");
  }

  // We assume the Edge Function returns the formatted JSON from Gemini.
  // We append local metadata here.
  return {
    ...data,
    id: data.id || Math.random().toString(36).substr(2, 9),
    interests: prefs.interests,
    createdAt: new Date().toISOString(),
    is_verified: true
  };
};
