import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generateCart } from "@/lib/cart-engine";
import { UserConfig } from "@/lib/types";
import { themes } from "@/data/themes";

export async function POST(request: NextRequest) {
  try {
    const { config, customerEmail } = (await request.json()) as {
      config: UserConfig;
      customerEmail: string;
    };

    if (!config || !customerEmail) {
      return NextResponse.json(
        { error: "Configuration et email requis" },
        { status: 400 }
      );
    }

    // Générer le panier
    const cart = generateCart(config);

    if (cart.items.length === 0) {
      return NextResponse.json(
        { error: "Le panier est vide" },
        { status: 400 }
      );
    }

    const themeName =
      themes.find((t) => t.id === config.theme)?.name ?? config.theme;

    // Créer les line_items Stripe
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          description: `${item.reason} — Thème ${themeName}`,
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      metadata: {
        theme: config.theme,
        guests: String(config.guests),
        tables: String(config.tables),
        tableShape: config.tableShape,
        lieu: config.lieu,
        budget: config.budget,
      },
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "eur" },
            display_name: "Livraison standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1490, currency: "eur" },
            display_name: "Livraison express",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/commande/annulee`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
