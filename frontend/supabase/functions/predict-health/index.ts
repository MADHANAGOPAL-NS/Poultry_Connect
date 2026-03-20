import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRAINING_DATA = `
timestamp,temperature_c,humidity_pct,ammonia_ppm,co2_ppm,sound_db,bird_movement,stress_level,health_status
2026-02-01 06:00,24.5,62,8,420,48,72,low,normal
2026-02-01 08:00,26.8,65,10,450,52,75,low,normal
2026-02-01 10:00,29.2,70,15,600,60,68,medium,warning
2026-02-01 12:00,32.5,78,22,850,68,55,high,warning
2026-02-01 14:00,34.1,82,30,1200,75,40,high,critical
2026-02-01 16:00,33.0,80,28,1100,72,45,high,critical
2026-02-01 18:00,30.5,74,20,800,65,60,medium,warning
2026-02-01 20:00,28.0,70,14,550,58,70,low,normal
2026-02-01 22:00,26.0,66,10,480,50,78,low,normal
2026-02-02 00:00,25.2,64,9,450,47,80,low,normal
`;

const systemPrompt = `You are an expert poultry health prediction AI. You have been trained on the following sensor data patterns:

${TRAINING_DATA}

Based on this training data, you understand the correlations:
- Normal health: temperature 24-28°C, humidity 62-70%, ammonia <15ppm, CO2 <550ppm, sound <58dB, movement >70%
- Warning health: temperature 29-33°C, humidity 70-80%, ammonia 15-28ppm, CO2 550-1100ppm, sound 58-72dB, movement 45-70%
- Critical health: temperature >33°C, humidity >80%, ammonia >28ppm, CO2 >1100ppm, sound >72dB, movement <45%

Stress levels correlate with environmental conditions:
- Low stress: All parameters within normal range
- Medium stress: Some parameters elevated
- High stress: Multiple parameters in critical ranges

When given sensor readings, you MUST respond with a JSON object containing:
1. stress_level: "low", "medium", or "high"
2. health_status: "normal", "warning", or "critical"
3. confidence: percentage (0-100)
4. analysis: brief explanation of the prediction
5. recommendations: array of actionable suggestions`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, humidity, ammonia, co2, sound, movement } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userMessage = `Analyze these poultry sensor readings and predict the stress level and health status:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Ammonia: ${ammonia} ppm
- CO2: ${co2} ppm
- Sound Level: ${sound} dB
- Bird Movement: ${movement}%

Respond with a JSON object containing stress_level, health_status, confidence, analysis, and recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get prediction from AI");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let prediction;
    try {
      prediction = JSON.parse(content);
    } catch {
      prediction = {
        stress_level: "unknown",
        health_status: "unknown",
        confidence: 0,
        analysis: content,
        recommendations: ["Unable to parse AI response"]
      };
    }

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Prediction failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
