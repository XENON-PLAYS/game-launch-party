import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe?target=deno";
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
    const { planName, userId, email } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const planConfig: Record<string, { amount: number, productId: string }> = {
      "Mensal": { 
        amount: 500, // R$ 5,00
        productId: "prod_UGA3qOYFSDXjZw" 
      },
      "Semestral": { 
        amount: 2500, // R$ 25,00
        productId: "prod_UGA3qOYFSDXjZw"
      },
      "Anual": { 
        amount: 4500, // R$ 45,00
        productId: "prod_UGA3f7rVU6LR32"
      },
    };

    const config = planConfig[planName as keyof typeof planConfig];

    if (!config) {
      throw new Error(`Plano inválido: ${planName}`);
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: config.amount,
            product: config.productId,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/perfil?success=true`,
      cancel_url: `${origin}/checkout?plan=${planName}&canceled=true`,
      client_reference_id: userId,
      metadata: {
        planName,
        userId,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
