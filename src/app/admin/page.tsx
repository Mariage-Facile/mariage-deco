"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";

function getToken() {
  return sessionStorage.getItem("admin_token") || "";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    active: 0,
    categories: 0,
  });

  useEffect(() => {
    fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          const categories = new Set(data.map((p) => p.category));
          setStats({
            products: data.length,
            active: data.filter((p) => p.active !== false).length,
            categories: categories.size,
          });
        }
      });
  }, []);

  return (
    <div>
      <h1
        className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-[var(--color-accent)]">
            {stats.products}
          </div>
          <div className="text-sm text-gray-500 mt-1">Produits total</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-500 mt-1">Produits actifs</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-3xl font-bold text-[var(--color-primary)]">
            {stats.categories}
          </div>
          <div className="text-sm text-gray-500 mt-1">Catégories</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Guide de démarrage
        </h2>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center flex-shrink-0">
              1
            </span>
            <span>
              Allez dans <strong>Produits</strong> pour ajouter vos vrais
              articles avec photos, prix et catégories.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center flex-shrink-0">
              2
            </span>
            <span>
              Associez chaque produit à un ou plusieurs <strong>thèmes</strong>{" "}
              pour que le générateur de panier les sélectionne correctement.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center flex-shrink-0">
              3
            </span>
            <span>
              Indiquez le <strong>prix d&apos;achat</strong> et la{" "}
              <strong>référence fournisseur</strong> pour suivre vos marges.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center flex-shrink-0">
              4
            </span>
            <span>
              Consultez les <strong>Commandes</strong> pour suivre les ventes.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
