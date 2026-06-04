import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.25.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { planName } = await req.json();

    // Validate planName
    const validPlans = ["Mensal", "Semestral", "Anual"];
    if (!planName || !validPlans.includes(planName)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const planConfig: Record<string, { amount: number, title: string }> = {
      "Mensal": { 
        amount: 500,
        title: "Plano Mensal VIP" 
      },
      "Semestral": { 
        amount: 2500,
        title: "Plano Semestral VIP"
      },
      "Anual": { 
        amount: 4500,
        title: "Plano Anual VIP"
      },
    };

    const config = planConfig[planName];

    // Allowlist of trusted origins to prevent open-redirect via the Origin header
    const ALLOWED_ORIGINS = [
      "https://game-launch-party.lovable.app",
      "https://id-preview--53a1dd10-71d2-4025-ab86-b9048968f97f.lovable.app",
      "http://localhost:3000",
    ];
    const requestOrigin = req.headers.get("origin") || "";
    const origin = ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : ALLOWED_ORIGINS[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: config.amount,
            product_data: {
              name: config.title,
              description: `Acesso VIP ao site ELITE Studio - Plano ${planName}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/perfil?success=true`,
      cancel_url: `${origin}/checkout?plan=${planName}&canceled=true`,
      client_reference_id: user.id,
      metadata: {
        planName,
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
