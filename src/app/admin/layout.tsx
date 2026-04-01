"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_token", password);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
        >
          <h1
            className="text-2xl font-bold text-[var(--color-primary-dark)] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Administration
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe admin"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] mb-4"
          />
          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--color-primary)] transition-colors"
          >
            Connexion
          </button>
        </form>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Tableau de bord" },
    { href: "/admin/produits", label: "Produits" },
    { href: "/admin/commandes", label: "Commandes" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[var(--color-primary-dark)] min-h-screen p-6 flex-shrink-0">
          <h1
            className="text-xl font-bold text-white mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin
          </h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 pt-4 border-t border-white/20">
            <Link
              href="/"
              className="text-white/50 text-sm hover:text-white transition-colors"
            >
              Retour au site
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
