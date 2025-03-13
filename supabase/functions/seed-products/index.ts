
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get all stands first
    const { data: stands, error: standsError } = await supabaseClient
      .from("stands")
      .select("*");

    if (standsError) throw standsError;

    // Only proceed if we have stands
    if (!stands || stands.length === 0) {
      throw new Error("No stands found in the database");
    }

    // Map of stand names to their IDs
    const standMap = stands.reduce((acc, stand) => {
      acc[stand.name] = stand.id;
      return acc;
    }, {});

    // Sample products for each stand
    const products = [
      // Pastel Stand
      {
        name: "Pastel de Carne",
        description: "Delicioso pastel recheado com carne moída temperada",
        price: 8.90,
        stock: 50,
        stand_id: standMap["Pastel"],
        image_url: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Pastel de Queijo",
        description: "Pastel crocante recheado com queijo mussarela derretido",
        price: 7.90,
        stock: 50,
        stand_id: standMap["Pastel"],
        image_url: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Pastel de Frango",
        description: "Pastel recheado com frango desfiado e catupiry",
        price: 9.90,
        stock: 30,
        stand_id: standMap["Pastel"],
        image_url: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=400&auto=format&fit=crop"
      },
      // Doces Stand
      {
        name: "Brigadeiro Gourmet",
        description: "Delicioso brigadeiro feito com chocolate belga",
        price: 4.50,
        stock: 40,
        stand_id: standMap["Doces"],
        image_url: "https://images.unsplash.com/photo-1611059877272-b4272e813bf4?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Beijinho de Coco",
        description: "Doce tradicional brasileiro feito com leite condensado e coco",
        price: 3.90,
        stock: 45,
        stand_id: standMap["Doces"],
        image_url: "https://images.unsplash.com/photo-1648923531540-4facdf73085d?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Pudim de Leite",
        description: "Pudim cremoso de leite condensado com calda de caramelo",
        price: 6.90,
        stock: 25,
        stand_id: standMap["Doces"],
        image_url: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=400&auto=format&fit=crop"
      },
      // Hambúrgueres Stand
      {
        name: "Hambúrguer Artesanal",
        description: "Hambúrguer artesanal com 180g de carne, queijo, alface e tomate",
        price: 22.90,
        stock: 35,
        stand_id: standMap["Hambúrgueres"],
        image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Cheese Bacon",
        description: "Hambúrguer com queijo cheddar, bacon crocante, cebola caramelizada e molho especial",
        price: 26.90,
        stock: 30,
        stand_id: standMap["Hambúrgueres"],
        image_url: "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Veggie Burger",
        description: "Hambúrguer vegetariano feito com grão de bico, cenoura, abobrinha e temperos",
        price: 19.90,
        stock: 20,
        stand_id: standMap["Hambúrgueres"],
        image_url: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=400&auto=format&fit=crop"
      }
    ];

    // Insert products into database
    const { data: result, error: insertError } = await supabaseClient
      .from("products")
      .insert(products)
      .select();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully seeded ${result.length} products`,
        productsAdded: result
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
