"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

interface OrderDetails {
  customerEmail: string;
  amount: number;
  shippingName: string;
  shippingCity: string;
}

export default function SuccesPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-20 text-center">Chargement...</div>}>
      <SuccesContent />
    </Suspense>
  );
}

function SuccesContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/order-details?session_id=${sessionId}`)
        .then((res) => res.json())
        .then(setOrder)
        .catch(() => {});
    }
  }, [sessionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1
        className="text-4xl font-bold text-[var(--color-primary-dark)] mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Commande confirmee !
      </h1>

      <p className="text-lg text-[var(--color-text-light)] mb-8">
        Merci pour votre commande. Vous allez recevoir un email de confirmation
        {order?.customerEmail && (
          <span>
            {" "}
            a <strong>{order.customerEmail}</strong>
          </span>
        )}
        .
      </p>

      {order && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)] mb-8 text-left">
          <h3 className="font-semibold text-[var(--color-primary-dark)] mb-4">
            Details de la commande
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-light)]">Montant</span>
              <span className="font-semibold">
                {(order.amount / 100).toFixed(2)} EUR
              </span>
            </div>
            {order.shippingName && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-light)]">
                  Livraison a
                </span>
                <span className="font-semibold">
                  {order.shippingName}, {order.shippingCity}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-light)]">
          Votre decoration sera expediee sous 2 a 5 jours ouvrables.
          <br />
          Un email avec le numero de suivi vous sera envoye a l&apos;expedition.
        </p>
        <Link
          href="/"
          className="inline-block bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-primary)] transition-colors"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
