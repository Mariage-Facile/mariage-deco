import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id requis" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await stripe.checkout.sessions.retrieve(sessionId) as any;

    return NextResponse.json({
      customerEmail: session.customer_details?.email ?? session.customer_email ?? "",
      amount: session.amount_total ?? 0,
      shippingName: session.shipping_details?.name ?? "",
      shippingCity: session.shipping_details?.address?.city ?? "",
    });
  } catch {
    return NextResponse.json(
      { error: "Session introuvable" },
      { status: 404 }
    );
  }
}
