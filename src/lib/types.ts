// ===== THÈMES =====
export type ThemeId =
  | "champetre"
  | "boheme"
  | "romantique"
  | "moderne"
  | "provencal"
  | "royal";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: string[]; // couleurs dominantes (hex)
  image: string; // chemin image preview
}

// ===== PRODUITS =====
export type ProductCategory =
  | "centre-de-table"
  | "chemin-de-table"
  | "serviette"
  | "bougie"
  | "marque-place"
  | "menu"
  | "vase"
  | "guirlande"
  | "nappe"
  | "housse-chaise"
  | "petale"
  | "confetti"
  | "photobooth"
  | "candy-bar"
  | "livre-or"
  | "arche"
  | "ceremonie";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  themes: ThemeId[]; // thèmes compatibles
  price: number; // prix unitaire TTC en euros
  image: string;
  description: string;
  unit: string; // "pièce", "lot de 10", "mètre", etc.
  indoor: boolean;
  outdoor: boolean;
}

// ===== CONFIGURATION UTILISATEUR =====
export type TableShape = "ronde" | "rectangulaire" | "ovale";
export type Lieu = "interieur" | "exterieur" | "mixte";
export type Saison = "printemps" | "ete" | "automne" | "hiver";
export type Budget = "essentiel" | "standard" | "premium";

export interface UserConfig {
  theme: ThemeId;
  guests: number;
  tables: number;
  tableShape: TableShape;
  lieu: Lieu;
  saison: Saison;
  budget: Budget;
  options: {
    ceremonieLaique: boolean;
    candyBar: boolean;
    photobooth: boolean;
    livreOr: boolean;
  };
}

// ===== PANIER =====
export interface CartItem {
  product: Product;
  quantity: number;
  reason: string; // explication du calcul (ex: "1 par table × 8 tables")
}

export interface GeneratedCart {
  items: CartItem[];
  totalHT: number;
  totalTTC: number;
  config: UserConfig;
}
