// ===== THÈMES =====
export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: string[];
  image: string;
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
  themes: string[];
  price: number;
  image: string;
  description: string;
  unit: string;
  indoor: boolean;
  outdoor: boolean;
  active?: boolean;
  cost_price?: number;
  supplier_ref?: string;
  stock?: number;
}

// ===== CONFIGURATION UTILISATEUR =====
export type TableShape = "ronde" | "rectangulaire" | "ovale";
export type Lieu = "interieur" | "exterieur" | "mixte";
export type Saison = "printemps" | "ete" | "automne" | "hiver";
export type Budget = "essentiel" | "standard" | "premium";

export interface UserConfig {
  theme: string;
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
  reason: string;
}

export interface GeneratedCart {
  items: CartItem[];
  totalHT: number;
  totalTTC: number;
  config: UserConfig;
}
