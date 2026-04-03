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
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), { status: 500 });
    }

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { planName, userId } = session.metadata;

      if (!planName || !userId) {
        console.error("Missing metadata in checkout session");
        return new Response(JSON.stringify({ error: "Missing metadata" }), { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const durations: Record<string, number> = {
        "Mensal": 30,
        "Semestral": 180,
        "Anual": 365,
      };

      const daysToAdd = durations[planName] || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);

      const { data: currentProfile, error: profileError } = await supabase
        .from("profiles")
        .select("badges")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching current profile:", profileError);
        return new Response(JSON.stringify({ error: "Failed to fetch profile" }), { status: 500 });
      }

      const currentBadges = currentProfile.badges || [];
      const updatedBadges = Array.from(new Set([...currentBadges, "VIP"]));

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_vip: true,
          vip_expires_at: expiresAt.toISOString(),
          badges: updatedBadges,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
      }

      console.log(`User ${userId} upgraded to VIP for ${planName}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
