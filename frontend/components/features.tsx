import {
  Camera,
  Brain,
  FileText,
  Database,
  GitBranch,
  ShieldCheck,
} from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Capture par smartphone",
    description:
      "Prenez simplement une photo avec votre smartphone. Notre moteur IA analyse l'image en quelques secondes.",
  },
  {
    icon: Brain,
    title: "Prediction intelligente",
    description:
      "Classe de maladie predite, score de confiance et statut (OK, UNCERTAIN, FAILED) pour chaque analyse.",
  },
  {
    icon: FileText,
    title: "Rapport diagnostique",
    description:
      "Generation automatique d'un rapport avec un resume court et le traitement recommande.",
  },
  {
    icon: Database,
    title: "Stockage pour amelioration",
    description:
      "Photos, metadonnees et sorties du modele sont stockees pour ameliorer continuellement le systeme.",
  },
  {
    icon: GitBranch,
    title: "Modele versionne",
    description:
      "Registre de modeles avec configs reproductibles, seuils de confiance definis et suivi des versions.",
  },
  {
    icon: ShieldCheck,
    title: "Controle qualite",
    description:
      "Suppression des doublons, images floues, mauvais labels et verifications de biais pour des donnees fiables.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[#ADE1F7]">
            Fonctionnalites
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Un pipeline complet de detection de maladies
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            De la capture d{"'"}image au rapport diagnostique, notre module AI/ML
            couvre l{"'"}ensemble du processus.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-[#ADE1F7]/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ADE1F7]/10 text-[#ADE1F7] transition-colors group-hover:bg-[#ADE1F7] group-hover:text-[#ADE1F7]-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
