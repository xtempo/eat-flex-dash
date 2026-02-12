import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "INR", "NPR", "CNY", "JPY"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use a free exchange rate API (no key required)
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter to only supported currencies
    const rates: Record<string, number> = {};
    for (const currency of SUPPORTED_CURRENCIES) {
      if (data.rates[currency]) {
        rates[currency] = data.rates[currency];
      }
    }

    return new Response(JSON.stringify({ base: "USD", rates }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch exchange rates" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
