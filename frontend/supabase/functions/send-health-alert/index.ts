import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { health_status, stress_level, analysis, email } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.log("RESEND_API_KEY not configured, skipping email alert");
      return new Response(JSON.stringify({ message: "Email alerts not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendKey);

    const emailResponse = await resend.emails.send({
      from: "PoultryConnect Alerts <alerts@poultryconnect.com>",
      to: [email],
      subject: `⚠️ CRITICAL: Poultry Health Alert - ${health_status.toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">⚠️ Critical Health Alert</h1>
          </div>
          <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 0 0 8px 8px;">
            <p><strong>Health Status:</strong> <span style="color: #dc2626; font-weight: bold;">${health_status.toUpperCase()}</span></p>
            <p><strong>Stress Level:</strong> ${stress_level}</p>
            <p><strong>Analysis:</strong> ${analysis}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">This is an automated alert from PoultryConnect AI Health Predictor. Please check your flock immediately.</p>
          </div>
        </div>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending health alert email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
