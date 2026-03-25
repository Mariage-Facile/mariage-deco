import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { saveOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erreur vérification webhook:", err);
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  // Traiter les événements
  switch (event.type) {
    case "checkout.session.completed": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;

      // Sauvegarder la commande
      await saveOrder({
        id: session.id,
        email: session.customer_details?.email ?? session.customer_email ?? "",
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        status: "paid",
        shippingName: session.shipping_details?.name ?? "",
        shippingAddress: session.shipping_details?.address
          ? `${session.shipping_details.address.line1}, ${session.shipping_details.address.postal_code} ${session.shipping_details.address.city}`
          : "",
        theme: session.metadata?.theme ?? "",
        guests: Number(session.metadata?.guests ?? 0),
        tables: Number(session.metadata?.tables ?? 0),
        createdAt: new Date().toISOString(),
      });

      console.log(`Commande confirmée: ${session.id} — ${session.customer_details?.email}`);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Session expirée: ${session.id}`);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
