"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-bold text-[var(--color-primary)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mariage Déco
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/configurateur"
            className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
          >
            Configurateur
          </Link>
          <Link
            href="/configurateur"
            className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full hover:bg-[var(--color-primary)] transition-colors font-semibold"
          >
            Composer ma déco
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--color-primary)]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] px-4 py-4 flex flex-col gap-4 bg-white">
          <Link
            href="/"
            className="text-[var(--color-text-light)]"
            onClick={() => setMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/configurateur"
            className="text-[var(--color-text-light)]"
            onClick={() => setMenuOpen(false)}
          >
            Configurateur
          </Link>
          <Link
            href="/configurateur"
            className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-center font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Composer ma déco
          </Link>
        </nav>
      )}
    </header>
  );
}
