"use client";

import { useState, useEffect, useRef } from "react";
import type { Product, ProductCategory, Theme } from "@/lib/types";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "centre-de-table", label: "Centre de table" },
  { value: "chemin-de-table", label: "Chemin de table" },
  { value: "serviette", label: "Serviette" },
  { value: "bougie", label: "Bougie" },
  { value: "marque-place", label: "Marque-place" },
  { value: "guirlande", label: "Guirlande" },
  { value: "nappe", label: "Nappe" },
  { value: "petale", label: "Pétale" },
  { value: "confetti", label: "Confetti" },
  { value: "photobooth", label: "Photobooth" },
  { value: "candy-bar", label: "Candy bar" },
  { value: "livre-or", label: "Livre d'or" },
  { value: "arche", label: "Arche" },
  { value: "ceremonie", label: "Cérémonie" },
  { value: "vase", label: "Vase" },
  { value: "housse-chaise", label: "Housse de chaise" },
  { value: "menu", label: "Menu" },
];

function getToken() {
  return sessionStorage.getItem("admin_token") || "";
}

const emptyProduct = {
  name: "",
  category: "centre-de-table" as ProductCategory,
  themes: [] as string[],
  price: 0,
  cost_price: 0,
  image: "",
  description: "",
  unit: "pièce",
  indoor: true,
  outdoor: true,
  active: true,
  supplier_ref: "",
  stock: 0,
};

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [productsRes, themesRes] = await Promise.all([
      fetch("/api/admin/products", { headers }),
      fetch("/api/admin/themes", { headers }),
    ]);
    const productsData = await productsRes.json();
    const themesData = await themesRes.json();
    if (Array.isArray(productsData)) setProducts(productsData);
    if (Array.isArray(themesData)) setThemes(themesData);
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      themes: product.themes || [],
      price: product.price,
      cost_price: product.cost_price || 0,
      image: product.image,
      description: product.description,
      unit: product.unit,
      indoor: product.indoor,
      outdoor: product.outdoor,
      active: product.active !== false,
      supplier_ref: product.supplier_ref || "",
      stock: product.stock || 0,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await fetch("/api/admin/products", {
          method: "PUT",
          headers,
          body: JSON.stringify({ id: editing.id, ...form }),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      await loadData();
    } catch {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
      headers,
    });
    await loadData();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || "Erreur upload");
      }
    } catch {
      alert("Erreur upload");
    } finally {
      setUploading(false);
    }
  }

  function toggleTheme(themeId: string) {
    setForm((prev) => ({
      ...prev,
      themes: prev.themes.includes(themeId)
        ? prev.themes.filter((t) => t !== themeId)
        : [...prev.themes, themeId],
    }));
  }

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const margin = form.price > 0 && form.cost_price && form.cost_price > 0
    ? (((form.price - form.cost_price) / form.price) * 100).toFixed(1)
    : null;

  if (loading) {
    return <div className="text-gray-500">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold text-[var(--color-primary-dark)]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Produits ({products.length})
        </h1>
        <button
          onClick={openNew}
          className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[var(--color-primary)] transition-colors"
        >
          + Nouveau produit
        </button>
      </div>

      {/* Filtre par catégorie */}
      <div className="mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
        >
          <option value="all">Toutes les catégories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des produits */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4 ${
              product.active === false
                ? "border-red-200 opacity-60"
                : "border-gray-200"
            }`}
          >
            {/* Image */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  No img
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">
                {product.name}
              </div>
              <div className="text-xs text-gray-500">
                {CATEGORIES.find((c) => c.value === product.category)?.label} —{" "}
                {product.unit}
                {product.supplier_ref && (
                  <span className="ml-2 text-gray-400">
                    Réf: {product.supplier_ref}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Thèmes :{" "}
                {product.themes?.join(", ") || "aucun"}
              </div>
            </div>

            {/* Prix */}
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-[var(--color-primary)]">
                {Number(product.price).toFixed(2)} €
              </div>
              {product.cost_price && Number(product.cost_price) > 0 && (
                <div className="text-xs text-gray-400">
                  Achat: {Number(product.cost_price).toFixed(2)} €
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(product)}
                className="px-3 py-1 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
              >
                Suppr.
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Aucun produit. Cliquez sur &quot;+ Nouveau produit&quot; pour commencer.
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 my-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editing ? "Modifier le produit" : "Nouveau produit"}
            </h2>

            <div className="space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Ex: Centre de table rondin de bois"
                />
              </div>

              {/* Catégorie + Unité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as ProductCategory,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité
                  </label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="pièce, lot de 10, mètre..."
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              {/* Prix de vente + Prix d'achat */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix de vente TTC (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix d&apos;achat (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost_price}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        cost_price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marge
                  </label>
                  <div className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                    {margin ? `${margin}%` : "—"}
                  </div>
                </div>
              </div>

              {/* Réf fournisseur + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence fournisseur
                  </label>
                  <input
                    type="text"
                    value={form.supplier_ref}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        supplier_ref: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                    placeholder="REF-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              {/* Thèmes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thèmes compatibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => toggleTheme(theme.id)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        form.themes.includes(theme.id)
                          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lieu */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.indoor}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        indoor: e.target.checked,
                      }))
                    }
                    className="accent-[var(--color-accent)]"
                  />
                  Intérieur
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.outdoor}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        outdoor: e.target.checked,
                      }))
                    }
                    className="accent-[var(--color-accent)]"
                  />
                  Extérieur
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        active: e.target.checked,
                      }))
                    }
                    className="accent-green-600"
                  />
                  Actif (visible sur le site)
                </label>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du produit
                </label>
                <div className="flex items-center gap-4">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      {uploading ? "Upload en cours..." : "Choisir une image"}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou WebP. Max 5 Mo.
                    </p>
                  </div>
                </div>
                {/* URL manuelle */}
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 mt-2 text-sm"
                  placeholder="Ou collez une URL d'image"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="px-6 py-2 rounded-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : editing
                    ? "Mettre à jour"
                    : "Créer le produit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
