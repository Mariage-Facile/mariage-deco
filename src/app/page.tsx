import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import type { Theme } from "@/lib/types";

async function getThemes(): Promise<Theme[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from("themes").select("*");
  return (data as Theme[]) || [];
}

export default async function HomePage() {
  const themes = await getThemes();

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#faf8f5] to-[#f0e8dd] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold text-[var(--color-primary-dark)] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Votre décoration de mariage,
            <br />
            <span className="text-[var(--color-accent)]">en quelques clics</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-light)] mb-10 max-w-2xl mx-auto">
            Choisissez un thème, indiquez le nombre d&apos;invités et de tables,
            et recevez instantanément un panier complet et personnalisé pour
            votre grand jour.
          </p>
          <Link
            href="/configurateur"
            className="inline-block bg-[var(--color-accent)] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-primary)] transition-colors shadow-lg"
          >
            Composer ma décoration
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2
          className="text-3xl font-bold text-center text-[var(--color-primary-dark)] mb-16"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "1",
              title: "Choisissez votre thème",
              desc: "Champêtre, bohème, romantique... Sélectionnez l'ambiance qui vous ressemble.",
            },
            {
              step: "2",
              title: "Personnalisez",
              desc: "Nombre d'invités, de tables, lieu, options... Dites-nous tout sur votre réception.",
            },
            {
              step: "3",
              title: "Recevez votre panier",
              desc: "Notre algorithme compose un panier sur mesure avec les quantités exactes. Commandez en un clic.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                {item.step}
              </div>
              <h3
                className="text-xl font-semibold text-[var(--color-primary-dark)] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-[var(--color-text-light)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THÈMES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center text-[var(--color-primary-dark)] mb-16"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos thèmes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => (
              <Link
                key={theme.id}
                href={`/configurateur?theme=${theme.id}`}
                className="group block bg-[var(--color-bg)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-32 flex">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold text-[var(--color-primary-dark)] mb-2 group-hover:text-[var(--color-accent)] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {theme.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-light)]">
                    {theme.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2
          className="text-3xl font-bold text-[var(--color-primary-dark)] mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Prêt(e) à créer votre ambiance ?
        </h2>
        <p className="text-[var(--color-text-light)] mb-10 max-w-xl mx-auto">
          Notre configurateur calcule automatiquement les quantités dont vous
          avez besoin. Plus de stress, plus d&apos;oublis.
        </p>
        <Link
          href="/configurateur"
          className="inline-block bg-[var(--color-primary)] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg"
        >
          Commencer maintenant
        </Link>
      </section>
    </>
  );
}
