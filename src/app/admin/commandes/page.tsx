"use client";

import { useState, useEffect } from "react";

interface Order {
  id: string;
  customer_email: string;
  total_ttc: number;
  total_ht: number;
  status: string;
  config: Record<string, unknown>;
  items: Record<string, unknown>[];
  created_at: string;
}

function getToken() {
  return sessionStorage.getItem("admin_token") || "";
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Chargement...</div>;

  return (
    <div>
      <h1
        className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Commandes ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-200">
          Aucune commande pour le moment. Elles apparaîtront ici quand des
          clients passeront commande sur le site.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-mono text-gray-400">
                  #{order.id.slice(0, 8)}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status === "paid"
                    ? "Payée"
                    : order.status === "pending"
                      ? "En attente"
                      : order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">
                    {order.customer_email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[var(--color-accent)]">
                    {Number(order.total_ttc).toFixed(2)} €
                  </div>
                  <div className="text-xs text-gray-400">
                    HT: {Number(order.total_ht).toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
