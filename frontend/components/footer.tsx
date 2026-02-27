export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  AG
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                AGILICIS
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Solutions de conseil et technologie pour la transformation
              digitale des entreprises.
            </p>
          </div>

          {/* Piliers */}
          <div>
            <p className="text-sm font-semibold text-foreground">
              Piliers strategiques
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">SAP Services</li>
              <li className="text-sm text-muted-foreground">Salesforce Expertise</li>
              <li className="text-sm text-muted-foreground">Digital Technology</li>
            </ul>
          </div>

          {/* Module */}
          <div>
            <p className="text-sm font-semibold text-foreground">Module AI/ML</p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fonctionnalites
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Comment ca marche
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#detection"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-foreground">Contact</p>
            <ul className="mt-4 flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">contact@agilicis.com</li>
              <li className="text-sm text-muted-foreground">Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 AGILICIS. Tous droits reserves.
          </p>
          <p className="text-xs text-muted-foreground">
            AI/ML Module - Detection de maladies par image
          </p>
        </div>
      </div>
    </footer>
  )
}
