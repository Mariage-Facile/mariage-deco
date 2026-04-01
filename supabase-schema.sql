-- =============================================
-- SCHÉMA SUPABASE — Mariage Déco
-- À exécuter dans l'éditeur SQL de Supabase
-- =============================================

-- Table des thèmes
CREATE TABLE themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  colors TEXT[] NOT NULL DEFAULT '{}',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  themes TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT 'pièce',
  indoor BOOLEAN NOT NULL DEFAULT true,
  outdoor BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  cost_price NUMERIC(10,2) DEFAULT 0,
  supplier_ref TEXT DEFAULT '',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);

-- Table des commandes (pour historique)
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  stripe_session_id TEXT,
  customer_email TEXT NOT NULL,
  config JSONB NOT NULL,
  items JSONB NOT NULL,
  total_ht NUMERIC(10,2) NOT NULL,
  total_ttc NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- STORAGE : Bucket pour les images produits
-- =============================================
-- À faire dans l'UI Supabase > Storage > New Bucket
-- Nom : "product-images"
-- Public : oui

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour thèmes et produits actifs
CREATE POLICY "Thèmes lisibles par tous" ON themes
  FOR SELECT USING (true);

CREATE POLICY "Produits actifs lisibles par tous" ON products
  FOR SELECT USING (active = true);

-- Les opérations d'écriture nécessitent la service_role key (admin)
CREATE POLICY "Admin full access themes" ON themes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- DONNÉES INITIALES : Thèmes
-- =============================================
INSERT INTO themes (id, name, description, colors) VALUES
  ('champetre', 'Champêtre', 'Ambiance naturelle et bucolique avec des matières brutes : bois, jute, lin et fleurs des champs.', ARRAY['#8B7355', '#A0C4A8', '#F5F0E8', '#D4A574']),
  ('boheme', 'Bohème', 'Esprit libre et poétique : macramé, plumes, herbes de la pampa et tons neutres.', ARRAY['#C9B99A', '#E8D5B7', '#F7F3ED', '#A68B6B']),
  ('romantique', 'Romantique', 'Douceur et élégance avec des roses, des drapés et une palette rose poudré.', ARRAY['#E8B4B8', '#F5D5D8', '#FFFFFF', '#C9929A']),
  ('moderne', 'Moderne & Minimaliste', 'Lignes épurées, géométrie et contraste noir/blanc rehaussé d''or.', ARRAY['#2D2D2D', '#FFFFFF', '#D4AF37', '#F5F5F5']),
  ('provencal', 'Provençal', 'Soleil du sud : lavande, olivier, céramique et tons bleu-jaune.', ARRAY['#7B68AE', '#F0C75E', '#EAE2D5', '#6B8E4E']),
  ('royal', 'Royal & Glamour', 'Luxe et faste : velours, cristal, dorures et couleurs profondes.', ARRAY['#1B1464', '#D4AF37', '#8B0000', '#FFFFFF']);
