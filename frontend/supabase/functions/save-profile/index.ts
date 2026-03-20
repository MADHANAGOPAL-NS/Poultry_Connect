import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, role, profile_data } = await req.json();

    if (!user_id || !role || !profile_data) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Verify the user exists in auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (authError || !authUser?.user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save user role
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id,
      role,
    });
    if (roleError) {
      console.error("Role save error:", roleError);
    }

    // Save role-specific profile
    if (role === "buyer") {
      const { error: profileError } = await supabaseAdmin.from("buyer_profiles").insert({
        user_id,
        full_name: profile_data.full_name,
        phone: profile_data.phone || null,
        location: profile_data.location || null,
        business_name: profile_data.business_name || null,
        preferred_products: profile_data.preferred_products || null,
      });
      if (profileError) {
        console.error("Buyer profile error:", profileError);
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (role === "seller") {
      const { error: profileError } = await supabaseAdmin.from("seller_profiles").insert({
        user_id,
        full_name: profile_data.full_name,
        phone: profile_data.phone || null,
        farm_name: profile_data.farm_name || null,
        farm_location: profile_data.farm_location || null,
        farm_size: profile_data.farm_size || null,
        poultry_types: profile_data.poultry_types || null,
        experience_years: profile_data.experience_years || null,
      });
      if (profileError) {
        console.error("Seller profile error:", profileError);
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
