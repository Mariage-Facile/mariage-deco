import Link from "next/link";

export default function AnnuleePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1
        className="text-3xl font-bold text-[var(--color-primary-dark)] mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Commande annulee
      </h1>

      <p className="text-lg text-[var(--color-text-light)] mb-8">
        Votre paiement a ete annule. Aucun montant n&apos;a ete debite.
        <br />
        Votre panier est toujours disponible.
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          href="/configurateur"
          className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-primary)] transition-colors"
        >
          Reprendre ma commande
        </Link>
        <Link
          href="/"
          className="px-8 py-3 rounded-full border-2 border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-primary)] transition-colors"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
