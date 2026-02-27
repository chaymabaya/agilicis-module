import { ArrowRight, Shield, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            AI/ML Module - Detection par Image
          </span>
        </div>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Detection intelligente
          <br />
          <span className="text-primary">des maladies</span>
          <br />
          par intelligence artificielle
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Un moteur de vision IA qui analyse vos photos prises par smartphone
          pour predire les maladies avec un score de confiance et generer des
          rapports diagnostiques complets.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="gap-2">
            <a href="#detection">
              Commencer l{"'"}analyse
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#api">Documentation API</a>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <Eye className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Vision par IA
            </span>
            <span className="text-xs text-muted-foreground">
              Analyse d{"'"}images avancee
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Resultats rapides
            </span>
            <span className="text-xs text-muted-foreground">
              Prediction en temps reel
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Score de confiance
            </span>
            <span className="text-xs text-muted-foreground">
              Fiabilite transparente
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
