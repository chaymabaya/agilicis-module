import { Terminal } from "lucide-react"

const requestCode = `POST /api/v1/predict/image HTTP/1.1
Content-Type: multipart/form-data

{
  "image": "<fichier image ou base64>",
  "metadata": {
    "geolocation": "48.8566, 2.3522",
    "timestamp": "2026-02-22T10:30:00Z",
    "device_info": "iPhone 15 Pro"
  }
}`

const responseCode = `{
  "predicted_class": "Mildiou de la tomate",
  "confidence_score": 0.94,
  "status": "OK",
  "top_k_predictions": [
    { "class": "Mildiou de la tomate", "score": 0.94 },
    { "class": "Oïdium", "score": 0.03 },
    { "class": "Tache bacterienne", "score": 0.02 }
  ],
  "explanation": {
    "model_version": "v2.3.1",
    "inference_time_ms": 142
  },
  "diagnostic_report": {
    "summary": "Detection de mildiou avec haute confiance.",
    "recommended_treatment": "Appliquer un fongicide a base de cuivre. Retirer les feuilles atteintes."
  }
}`

export function ApiSection() {
  return (
    <section id="api" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[#ADE1F7]">
            Inference API
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            API REST pour l{"'"}inference
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Integrez la detection de maladies dans votre application mobile ou
            web via notre endpoint API.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Request */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <Terminal className="h-4 w-4 text-[#ADE1F7]" />
              <span className="text-sm font-medium text-foreground">
                Requete
              </span>
              <span className="ml-auto rounded-md bg-[#ADE1F7]/10 px-2 py-0.5 text-xs font-medium text-[#ADE1F7]">
                POST
              </span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-muted-foreground font-mono">
              <code>{requestCode}</code>
            </pre>
          </div>

          {/* Response */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <Terminal className="h-4 w-4 text-[#ADE1F7]" />
              <span className="text-sm font-medium text-foreground">
                Reponse
              </span>
              <span className="ml-auto rounded-md bg-[#ADE1F7]/10 px-2 py-0.5 text-xs font-medium text-[#ADE1F7]">
                200 OK
              </span>
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-relaxed text-muted-foreground font-mono">
              <code>{responseCode}</code>
            </pre>
          </div>
        </div>

        {/* Status badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-foreground font-medium">OK</span>
            <span className="text-xs text-muted-foreground">
              Haute confiance
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="text-sm text-foreground font-medium">
              UNCERTAIN
            </span>
            <span className="text-xs text-muted-foreground">
              Basse confiance
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-sm text-foreground font-medium">FAILED</span>
            <span className="text-xs text-muted-foreground">
              Image invalide
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
