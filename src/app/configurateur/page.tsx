"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { themes } from "@/data/themes";
import type {
  ThemeId,
  TableShape,
  Lieu,
  Saison,
  Budget,
  UserConfig,
  GeneratedCart,
} from "@/lib/types";

const STEPS = [
  "Thème",
  "Réception",
  "Lieu & Saison",
  "Budget & Options",
  "Récapitulatif",
];

export default function ConfigurateurPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12">Chargement...</div>}>
      <ConfigurateurContent />
    </Suspense>
  );
}

function ConfigurateurContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<GeneratedCart | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  // Form state
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | "">(
    (searchParams.get("theme") as ThemeId) || ""
  );
  const [guests, setGuests] = useState(80);
  const [tables, setTables] = useState(8);
  const [tableShape, setTableShape] = useState<TableShape>("ronde");
  const [lieu, setLieu] = useState<Lieu>("interieur");
  const [saison, setSaison] = useState<Saison>("ete");
  const [budget, setBudget] = useState<Budget>("standard");
  const [options, setOptions] = useState({
    ceremonieLaique: false,
    candyBar: false,
    photobooth: false,
    livreOr: false,
  });

  // Auto-calculate suggested tables when guests change
  useEffect(() => {
    const seatsPerTable =
      tableShape === "rectangulaire" ? 10 : tableShape === "ovale" ? 8 : 8;
    setTables(Math.ceil(guests / seatsPerTable));
  }, [guests, tableShape]);

  const canNext = () => {
    if (step === 0) return selectedTheme !== "";
    return true;
  };

  const handleGenerate = async () => {
    if (!selectedTheme) return;
    setLoading(true);

    const config: UserConfig = {
      theme: selectedTheme as ThemeId,
      guests,
      tables,
      tableShape,
      lieu,
      saison,
      budget,
      options,
    };

    try {
      const res = await fetch("/api/generate-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setCart(data);
      setStep(4);
    } catch {
      alert("Erreur lors de la génération du panier. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              className={`text-xs md:text-sm font-medium transition-colors ${
                i === step
                  ? "text-[var(--color-accent)]"
                  : i < step
                    ? "text-[var(--color-primary)] cursor-pointer"
                    : "text-[var(--color-text-light)]/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0 : Choix du thème */}
      {step === 0 && (
        <div>
          <h2
            className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choisissez votre thème
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`text-left rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-[var(--color-accent)] shadow-lg scale-[1.02]"
                    : "border-transparent shadow-sm hover:shadow-md"
                }`}
              >
                <div className="h-20 flex">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-4 bg-white">
                  <h3
                    className="font-semibold text-[var(--color-primary-dark)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {theme.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-light)] mt-1">
                    {theme.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 : Réception */}
      {step === 1 && (
        <div>
          <h2
            className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Votre réception
          </h2>
          <div className="space-y-8 max-w-lg">
            {/* Nombre d'invités */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Nombre d&apos;invités
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="flex-1 accent-[var(--color-accent)]"
                />
                <span className="text-2xl font-bold text-[var(--color-primary)] w-16 text-right">
                  {guests}
                </span>
              </div>
            </div>

            {/* Forme des tables */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                Forme des tables
              </label>
              <div className="flex gap-4">
                {(
                  [
                    { value: "ronde", label: "Ronde", icon: "O" },
                    { value: "rectangulaire", label: "Rectangulaire", icon: "▭" },
                    { value: "ovale", label: "Ovale", icon: "⬭" },
                  ] as const
                ).map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => setTableShape(shape.value)}
                    className={`flex-1 py-4 rounded-xl border-2 text-center transition-all ${
                      tableShape === shape.value
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{shape.icon}</div>
                    <div className="text-sm font-medium">{shape.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nombre de tables */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                Nombre de tables
                <span className="font-normal text-[var(--color-text-light)] ml-2">
                  (suggestion auto : {Math.ceil(guests / 8)})
                </span>
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTables(Math.max(1, tables - 1))}
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg hover:bg-[var(--color-bg)]"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-[var(--color-primary)] w-12 text-center">
                  {tables}
                </span>
                <button
                  onClick={() => setTables(tables + 1)}
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-lg hover:bg-[var(--color-bg)]"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 : Lieu & Saison */}
      {step === 2 && (
        <div>
          <h2
            className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lieu & Saison
          </h2>
          <div className="space-y-8 max-w-lg">
            {/* Lieu */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                Type de lieu
              </label>
              <div className="flex gap-4">
                {(
                  [
                    { value: "interieur", label: "Intérieur", emoji: "🏛️" },
                    { value: "exterieur", label: "Extérieur", emoji: "🌿" },
                    { value: "mixte", label: "Mixte", emoji: "🏡" },
                  ] as const
                ).map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLieu(l.value)}
                    className={`flex-1 py-4 rounded-xl border-2 text-center transition-all ${
                      lieu === l.value
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{l.emoji}</div>
                    <div className="text-sm font-medium">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saison */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                Saison du mariage
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { value: "printemps", label: "Printemps", emoji: "🌸" },
                    { value: "ete", label: "Été", emoji: "☀️" },
                    { value: "automne", label: "Automne", emoji: "🍂" },
                    { value: "hiver", label: "Hiver", emoji: "❄️" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSaison(s.value)}
                    className={`py-4 rounded-xl border-2 text-center transition-all ${
                      saison === s.value
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 : Budget & Options */}
      {step === 3 && (
        <div>
          <h2
            className="text-3xl font-bold text-[var(--color-primary-dark)] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Budget & Options
          </h2>
          <div className="space-y-8 max-w-lg">
            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                Gamme de produits
              </label>
              <div className="space-y-3">
                {(
                  [
                    {
                      value: "essentiel",
                      label: "Essentiel",
                      desc: "L'indispensable : centres de table, serviettes, bougies",
                    },
                    {
                      value: "standard",
                      label: "Standard",
                      desc: "Essentiel + chemins de table, nappes, marque-places, pétales",
                    },
                    {
                      value: "premium",
                      label: "Premium",
                      desc: "Tout inclus : guirlandes, confettis et décoration complète",
                    },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setBudget(b.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      budget === b.value
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                    }`}
                  >
                    <div className="font-semibold text-[var(--color-primary-dark)]">
                      {b.label}
                    </div>
                    <div className="text-sm text-[var(--color-text-light)]">
                      {b.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text)] mb-3">
                Options supplémentaires
              </label>
              <div className="space-y-3">
                {[
                  {
                    key: "ceremonieLaique" as const,
                    label: "Cérémonie laïque",
                    desc: "Arche, voilage et tapis d'allée",
                  },
                  {
                    key: "candyBar" as const,
                    label: "Candy Bar",
                    desc: "Présentoir, bocaux et accessoires",
                  },
                  {
                    key: "photobooth" as const,
                    label: "Photobooth",
                    desc: "Kit accessoires et cadre géant",
                  },
                  {
                    key: "livreOr" as const,
                    label: "Livre d'or",
                    desc: "Livre d'or assorti au thème",
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        [opt.key]: !prev[opt.key],
                      }))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      options[opt.key]
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-light)]"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                        options[opt.key]
                          ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                          : "border-[var(--color-border)]"
                      }`}
                    >
                      {options[opt.key] && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--color-primary-dark)]">
                        {opt.label}
                      </div>
                      <div className="text-sm text-[var(--color-text-light)]">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4 : Récapitulatif / Panier généré */}
      {step === 4 && cart && (
        <div>
          <h2
            className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Votre panier personnalisé
          </h2>
          <p className="text-[var(--color-text-light)] mb-8">
            Thème{" "}
            <strong>
              {themes.find((t) => t.id === cart.config.theme)?.name}
            </strong>{" "}
            — {cart.config.guests} invités — {cart.config.tables} tables{" "}
            {cart.config.tableShape}s
          </p>

          <div className="space-y-4 mb-8">
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-[var(--color-border)]"
              >
                <div className="w-16 h-16 bg-[var(--color-bg)] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {item.product.category === "centre-de-table" && "🌸"}
                  {item.product.category === "chemin-de-table" && "🎀"}
                  {item.product.category === "serviette" && "🧻"}
                  {item.product.category === "bougie" && "🕯️"}
                  {item.product.category === "marque-place" && "📋"}
                  {item.product.category === "guirlande" && "✨"}
                  {item.product.category === "nappe" && "🏳️"}
                  {item.product.category === "petale" && "🌹"}
                  {item.product.category === "confetti" && "🎊"}
                  {item.product.category === "photobooth" && "📸"}
                  {item.product.category === "candy-bar" && "🍬"}
                  {item.product.category === "livre-or" && "📖"}
                  {item.product.category === "arche" && "⛩️"}
                  {item.product.category === "ceremonie" && "💒"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[var(--color-primary-dark)] text-sm">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {item.reason}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-[var(--color-primary)]">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </div>
                  <div className="text-xs text-[var(--color-text-light)]">
                    {item.quantity} × {item.product.price.toFixed(2)} €
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--color-text-light)]">
                Sous-total HT
              </span>
              <span className="font-semibold">
                {cart.totalHT.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--color-text-light)]">TVA (20%)</span>
              <span className="font-semibold">
                {(cart.totalTTC - cart.totalHT).toFixed(2)} €
              </span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-3 mt-3 flex justify-between items-center">
              <span
                className="text-xl font-bold text-[var(--color-primary-dark)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Total TTC
              </span>
              <span className="text-2xl font-bold text-[var(--color-accent)]">
                {cart.totalTTC.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Email pour la commande */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
              Votre email (pour la confirmation de commande)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text)]"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setStep(0)}
              className="px-6 py-3 rounded-full border-2 border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-primary)] transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={async () => {
                if (!customerEmail || !customerEmail.includes("@")) {
                  alert("Veuillez entrer un email valide.");
                  return;
                }
                setCheckoutLoading(true);
                try {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      config: cart.config,
                      customerEmail,
                    }),
                  });
                  const data = await res.json();
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    alert(data.error || "Erreur lors du paiement.");
                  }
                } catch {
                  alert("Erreur de connexion. Veuillez réessayer.");
                } finally {
                  setCheckoutLoading(false);
                }
              }}
              disabled={checkoutLoading}
              className="flex-1 bg-[var(--color-accent)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-primary)] transition-colors text-lg disabled:opacity-60"
            >
              {checkoutLoading
                ? "Redirection vers le paiement..."
                : `Commander — ${cart.totalTTC.toFixed(2)} €`}
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons (steps 0-3) */}
      {step < 4 && (
        <div className="flex justify-between mt-12">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`px-6 py-3 rounded-full border-2 border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-primary)] transition-colors ${
              step === 0 ? "invisible" : ""
            }`}
          >
            Précédent
          </button>

          {step < 3 ? (
            <button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="px-8 py-3 rounded-full bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-primary)] transition-colors disabled:opacity-60"
            >
              {loading ? "Génération en cours..." : "Générer mon panier"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
