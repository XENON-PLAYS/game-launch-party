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
    const { planName, userId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Map plan names to configuration
    const planConfig: Record<string, { amount: number, productId?: string }> = {
      "Mensal": { 
        amount: 500, 
        productId: "prod_UG9zjWjIIRzxYc" 
      },
      "Semestral": { 
        amount: 2500 
      },
      "Anual": { 
        amount: 4500 
      },
    };

    const config = planConfig[planName];

    if (!config) {
      throw new Error("Plano inválido");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: config.amount,
            ...(config.productId ? { product: config.productId } : {
              product_data: {
                name: `Plano VIP ${planName}`,
                description: `Acesso VIP por ${planName === "Mensal" ? "1 mês" : planName === "Semestral" ? "6 meses" : "1 ano"}`,
              }
            }),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/perfil?success=true`,
      cancel_url: `${req.headers.get("origin")}/vip?canceled=true`,
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
