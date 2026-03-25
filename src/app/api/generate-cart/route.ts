import { NextRequest, NextResponse } from "next/server";
import { generateCart } from "@/lib/cart-engine";
import { UserConfig } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const config: UserConfig = await request.json();

    // Validation basique
    if (!config.theme || !config.guests || !config.tables) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : theme, guests, tables" },
        { status: 400 }
      );
    }

    if (config.guests < 1 || config.guests > 500) {
      return NextResponse.json(
        { error: "Le nombre d'invités doit être entre 1 et 500" },
        { status: 400 }
      );
    }

    if (config.tables < 1 || config.tables > 100) {
      return NextResponse.json(
        { error: "Le nombre de tables doit être entre 1 et 100" },
        { status: 400 }
      );
    }

    const cart = generateCart(config);

    return NextResponse.json(cart);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération du panier" },
      { status: 500 }
    );
  }
}
