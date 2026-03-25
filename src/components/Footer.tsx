export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3
            className="text-xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mariage Déco
          </h3>
          <p className="text-sm leading-relaxed">
            Votre décoration de mariage personnalisée, livrée directement chez
            vous. Composez votre ambiance en quelques clics.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Liens utiles</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/configurateur" className="hover:text-white transition-colors">
                Configurateur
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Conditions générales
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Politique de confidentialité
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>contact@mariage-deco.fr</li>
            <li>01 23 45 67 89</li>
            <li>Lun - Ven : 9h - 18h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 text-center py-4 text-xs text-white/50">
        &copy; {new Date().getFullYear()} Mariage Déco. Tous droits réservés.
      </div>
    </footer>
  );
}
