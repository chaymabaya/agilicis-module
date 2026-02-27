import { Upload, Cpu, BarChart3, ClipboardList } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Telecharger l'image",
    description:
      "Envoyez une photo prise par smartphone via l'application mobile ou l'API REST.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Analyse par le modele IA",
    description:
      "Le moteur de vision IA traite l'image et execute le modele de classification entraine.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Prediction et score",
    description:
      "Le systeme retourne la classe de maladie predite, le score de confiance et le statut.",
  },
  {
    number: "04",
    icon: ClipboardList,
    title: "Rapport diagnostique",
    description:
      "Un rapport complet est genere avec le resume, les recommandations de traitement et les top-k predictions.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Processus
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Comment ca marche
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Un processus simple en 4 etapes pour obtenir un diagnostic fiable.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-full hidden h-px w-full bg-border lg:block" />
              )}
              <div className="flex flex-col items-start">
                <span className="text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
