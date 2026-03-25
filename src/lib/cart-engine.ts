import { products } from "@/data/products";
import {
  CartItem,
  GeneratedCart,
  Product,
  ProductCategory,
  UserConfig,
} from "@/lib/types";

/**
 * Moteur de génération automatique de panier.
 *
 * Logique :
 * 1. Filtre les produits compatibles avec le thème + lieu choisi
 * 2. Applique les règles de quantité par catégorie
 * 3. Adapte les produits selon le budget (essentiel/standard/premium)
 * 4. Ajoute les options supplémentaires si sélectionnées
 */

// ===== HELPERS =====

function filterByThemeAndLieu(config: UserConfig): Product[] {
  return products.filter((p) => {
    // Doit matcher le thème
    if (!p.themes.includes(config.theme)) return false;

    // Doit être compatible avec le lieu
    if (config.lieu === "exterieur" && !p.outdoor) return false;
    if (config.lieu === "interieur" && !p.indoor) return false;
    // "mixte" : on accepte tout

    return true;
  });
}

function findBestProduct(
  available: Product[],
  category: ProductCategory
): Product | null {
  const candidates = available.filter((p) => p.category === category);
  if (candidates.length === 0) return null;
  // Retourne le premier trouvé (on pourrait prioriser par prix selon budget)
  return candidates[0];
}

function findAllProducts(
  available: Product[],
  category: ProductCategory
): Product[] {
  return available.filter((p) => p.category === category);
}

// ===== RÈGLES DE CALCUL DES QUANTITÉS =====

interface QuantityRule {
  category: ProductCategory;
  calculate: (config: UserConfig) => number;
  reason: (config: UserConfig, qty: number) => string;
  budgetLevels: ("essentiel" | "standard" | "premium")[];
}

const quantityRules: QuantityRule[] = [
  // --- 1 centre de table par table ---
  {
    category: "centre-de-table",
    calculate: (c) => c.tables,
    reason: (c, qty) => `1 par table × ${c.tables} tables = ${qty}`,
    budgetLevels: ["essentiel", "standard", "premium"],
  },

  // --- 1 chemin de table par table ---
  {
    category: "chemin-de-table",
    calculate: (c) => c.tables,
    reason: (c, qty) => `1 par table × ${c.tables} tables = ${qty}`,
    budgetLevels: ["standard", "premium"],
  },

  // --- Serviettes : 1 par invité (lots de 10) ---
  {
    category: "serviette",
    calculate: (c) => Math.ceil(c.guests / 10),
    reason: (c, qty) =>
      `1 par invité (lots de 10) : ${c.guests} invités → ${qty} lot(s)`,
    budgetLevels: ["essentiel", "standard", "premium"],
  },

  // --- Bougies : 1 lot par table ---
  {
    category: "bougie",
    calculate: (c) => c.tables,
    reason: (c, qty) => `1 lot par table × ${c.tables} tables = ${qty}`,
    budgetLevels: ["essentiel", "standard", "premium"],
  },

  // --- Marque-places : 1 par invité (lots de 10) ---
  {
    category: "marque-place",
    calculate: (c) => Math.ceil(c.guests / 10),
    reason: (c, qty) =>
      `1 par invité (lots de 10) : ${c.guests} invités → ${qty} lot(s)`,
    budgetLevels: ["standard", "premium"],
  },

  // --- Guirlandes : dépend de la forme et taille des tables ---
  {
    category: "guirlande",
    calculate: (c) => {
      if (c.tableShape === "rectangulaire") {
        // 2 guirlandes par table rectangulaire (les 2 longueurs)
        return c.tables * 2;
      }
      // 1 guirlande par table ronde/ovale
      return c.tables;
    },
    reason: (c, qty) => {
      if (c.tableShape === "rectangulaire") {
        return `2 par table rectangulaire × ${c.tables} tables = ${qty}`;
      }
      return `1 par table ${c.tableShape} × ${c.tables} tables = ${qty}`;
    },
    budgetLevels: ["premium"],
  },

  // --- Nappes : 1 par table ---
  {
    category: "nappe",
    calculate: (c) => c.tables,
    reason: (c, qty) => `1 par table × ${c.tables} tables = ${qty}`,
    budgetLevels: ["standard", "premium"],
  },

  // --- Pétales : 1 lot pour l'ensemble (déco de table) ---
  {
    category: "petale",
    calculate: (c) => Math.ceil(c.tables / 5),
    reason: (c, qty) => `1 lot pour 5 tables → ${qty} lot(s)`,
    budgetLevels: ["standard", "premium"],
  },

  // --- Confettis : 1 sachet par table ---
  {
    category: "confetti",
    calculate: (c) => c.tables,
    reason: (c, qty) => `1 sachet par table × ${c.tables} tables = ${qty}`,
    budgetLevels: ["premium"],
  },
];

// ===== OPTIONS SUPPLÉMENTAIRES =====

function addOptionItems(
  config: UserConfig,
  available: Product[],
  items: CartItem[]
): void {
  if (config.options.photobooth) {
    const kit = findBestProduct(available, "photobooth");
    if (kit) {
      items.push({
        product: kit,
        quantity: 1,
        reason: "1 kit photobooth",
      });
    }
    const cadre = available.find(
      (p) => p.category === "photobooth" && p.id.includes("cadre")
    );
    if (cadre) {
      items.push({
        product: cadre,
        quantity: 1,
        reason: "1 cadre photobooth",
      });
    }
  }

  if (config.options.candyBar) {
    const candyProducts = findAllProducts(available, "candy-bar");
    for (const product of candyProducts) {
      items.push({
        product,
        quantity: 1,
        reason: "Option candy bar",
      });
    }
  }

  if (config.options.livreOr) {
    const livre = findBestProduct(available, "livre-or");
    if (livre) {
      items.push({
        product: livre,
        quantity: 1,
        reason: "1 livre d'or",
      });
    }
  }

  if (config.options.ceremonieLaique) {
    // Arche
    const arche = findBestProduct(available, "arche");
    if (arche) {
      items.push({
        product: arche,
        quantity: 1,
        reason: "1 arche pour cérémonie laïque",
      });
    }
    // Voilage
    const voilage = available.find(
      (p) => p.category === "ceremonie" && p.id.includes("voilage")
    );
    if (voilage) {
      items.push({
        product: voilage,
        quantity: 2,
        reason: "2 voilages pour l'arche",
      });
    }
    // Tapis d'allée
    const tapis = available.find(
      (p) => p.category === "ceremonie" && p.id.includes("tapis")
    );
    if (tapis) {
      items.push({
        product: tapis,
        quantity: 1,
        reason: "1 tapis d'allée de cérémonie",
      });
    }
  }
}

// ===== MOTEUR PRINCIPAL =====

export function generateCart(config: UserConfig): GeneratedCart {
  const available = filterByThemeAndLieu(config);
  const items: CartItem[] = [];

  // Appliquer chaque règle de quantité
  for (const rule of quantityRules) {
    // Vérifier si la catégorie est incluse dans ce niveau de budget
    if (!rule.budgetLevels.includes(config.budget)) continue;

    const product = findBestProduct(available, rule.category);
    if (!product) continue;

    const quantity = rule.calculate(config);
    if (quantity <= 0) continue;

    items.push({
      product,
      quantity,
      reason: rule.reason(config, quantity),
    });
  }

  // Ajouter les options
  addOptionItems(config, available, items);

  // Calcul des totaux
  const totalTTC = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalHT = totalTTC / 1.2; // TVA 20%

  return {
    items,
    totalTTC: Math.round(totalTTC * 100) / 100,
    totalHT: Math.round(totalHT * 100) / 100,
    config,
  };
}
