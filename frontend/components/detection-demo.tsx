"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ImageIcon,
  RotateCcw,
  Sparkles,
  Shield,
  Activity,
  FileText,
  ChevronRight,
  AlertCircle,
  Download,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { apiClient, Prediction } from "@/lib/api-client"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

type Status = "idle" | "uploading" | "analyzing" | "done" | "error"
type PredictionStatus = "OK" | "UNCERTAIN" | "FAILED"
type ThemeType = "light" | "dark"

// Theme color configuration
const themeConfig = {
  light: {
    primary: "#0066CC",
    primaryLight: "#E3F2FD",
    text: "#1A1A1A",
    textMuted: "#666666",
    bg: "#FFFFFF",
    bgCard: "#F9FAFB",
    border: "#E5E7EB",
  },
  dark: {
    primary: "#ADE1F7",
    primaryLight: "#ADE1F7",
    text: "#FFFFFF",
    textMuted: "#A0AEC0",
    bg: "#0A0E27",
    bgCard: "#1A1F3A",
    border: "#2D3748",
  },
}

function StatusBadge({ status, theme = "dark" }: { status: PredictionStatus; theme?: ThemeType }) {
  if (theme === "dark") {
    // Keep original dark mode styling
    const config = {
      OK: {
        icon: CheckCircle2,
        label: "Haute confiance",
        classes: "bg-[#ADE1F7]/10  border-[#ADE1F7]/20 text-[#ADE1F7]",
      },
      UNCERTAIN: {
        icon: AlertTriangle,
        label: "Incertain",
        classes: "bg-warning/10 text-warning border-warning/20 text-[#ADE1F7]",
      },
      FAILED: {
        icon: XCircle,
        label: "Echec",
        classes: "bg-destructive/10 text-destructive border-destructive/20 text-[#ADE1F7]",
      },
    }
    const { icon: Icon, label, classes } = config[status]
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
    )
  }

  // Light mode styling
  const colors = themeConfig[theme]
  const lightConfig = {
    OK: {
      icon: CheckCircle2,
      label: "Haute confiance",
      bgColor: "#E3F2FD",
      textColor: "#0066CC",
      borderColor: "#1714cf",
    },
    UNCERTAIN: {
      icon: AlertTriangle,
      label: "Incertain",
      bgColor: "#FFF3E0",
      textColor: "#E65100",
      borderColor: "#FFE0B2",
    },
    FAILED: {
      icon: XCircle,
      label: "Echec",
      bgColor: "#FFEBEE",
      textColor: "#C62828",
      borderColor: "#FFCDD2",
    },
  }
  const { icon: Icon, label, bgColor, textColor, borderColor } = lightConfig[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: borderColor,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

function ConfidenceBar({
  score,
  label,
  isMain,
  theme = "dark",
}: {
  score: number
  label: string
  isMain?: boolean
  theme?: ThemeType
}) {
  const pct = Math.round(score * 100)

  if (theme === "dark") {
    // Keep original dark mode styling
    return (
      <div className="flex items-center gap-3">
        <span
          className={`w-40 shrink-0 truncate text-sm ${isMain ? "font-medium text-foreground" : "text-muted-foreground"}`}
        >
          {label}
        </span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${isMain ? "bg-[#ADE1F7]" : "bg-muted-foreground/40"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={`w-10 shrink-0 text-right font-mono text-sm ${isMain ? "font-semibold text-[#ADE1F7]" : "text-muted-foreground"}`}
        >
          {pct}%
        </span>
      </div>
    )
  }

  // Light mode styling
  const colors = themeConfig[theme]
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-40 shrink-0 truncate text-sm"
        style={{
          fontWeight: isMain ? "600" : "400",
          color: isMain ? colors.text : colors.textMuted,
        }}
      >
        {label}
      </span>
      <div
        className="relative h-2 flex-1 overflow-hidden rounded-full"
        style={{
          backgroundColor: "#E0E0E0",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: isMain ? colors.primary : colors.textMuted + "66",
          }}
        />
      </div>
      <span
        className="w-10 shrink-0 text-right font-mono text-sm"
        style={{
          fontWeight: isMain ? "700" : "400",
          color: isMain ? colors.primary : colors.textMuted,
        }}
      >
        {pct}%
      </span>
    </div>
  )
}

export function DetectionDemo() {
  const [status, setStatus] = useState<Status>("idle")
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<Prediction | null>(null)
  const [progress, setProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [theme, setTheme] = useState<ThemeType>("dark")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colors = themeConfig[theme]

  useEffect(() => {
    // Check backend health on mount
    const checkBackend = async () => {
      const isHealthy = await apiClient.checkHealth()
      if (!isHealthy) {
        setErrorMessage("Backend is not accessible. Please ensure the API server is running.")
      }
    }
    checkBackend()
  }, [])

  const analyzeImage = useCallback(async (file: File) => {
    setStatus("uploading")
    setProgress(0)
    setResult(null)
    setErrorMessage(null)

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((p) => {
          if (p >= 40) {
            clearInterval(uploadInterval)
            return 40
          }
          return p + 4
        })
      }, 40)

      // Call the API
      setStatus("analyzing")
      const response = await apiClient.predictImage(file)

      clearInterval(uploadInterval)

      if (response.success && response.data) {
        setResult(response.data)
        setStatus("done")
        setProgress(100)
      } else {
        setErrorMessage(response.error || "Failed to analyze image")
        setStatus("error")
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
      setStatus("error")
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setPreview(ev.target?.result as string)
          setCurrentFile(file)
          analyzeImage(file)
        }
        reader.readAsDataURL(file)
      }
    },
    [analyzeImage]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setPreview(ev.target?.result as string)
          setCurrentFile(file)
          analyzeImage(file)
        }
        reader.readAsDataURL(file)
      }
    },
    [analyzeImage]
  )

  const handleExport = useCallback(async () => {
    if (!result) return

    try {
      // Create PDF dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin
      
      let yPosition = margin

      // Add header
      pdf.setFontSize(20)
      pdf.setFont(undefined, "bold")
      pdf.text("RAPPORT DIAGNOSTIQUE", margin, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont(undefined, "normal")
      pdf.setTextColor(120, 120, 120)
      const now = new Date()
      pdf.text(
        `Date: ${now.toLocaleDateString("fr-FR")} - Heure: ${now.toLocaleTimeString("fr-FR")}`,
        margin,
        yPosition
      )
      yPosition += 10

      pdf.setTextColor(0, 0, 0)

      // Add image if available
      if (preview) {
        try {
          const imgHeight = 50
          pdf.addImage(preview, "JPEG", margin, yPosition, contentWidth, imgHeight)
          yPosition += imgHeight + 10
        } catch (e) {
          console.error("Failed to add image:", e)
          yPosition += 10
        }
      }

      // Add maladie detectee section
      pdf.setFontSize(12)
      pdf.setFont(undefined, "bold")
      pdf.text("Maladie Détectée", margin, yPosition)
      yPosition += 7

      pdf.setFontSize(16)
      pdf.setTextColor(0, 102, 204)
      pdf.setFont(undefined, "bold")
      pdf.text(result.predicted_class, margin, yPosition)
      yPosition += 12
      pdf.setTextColor(0, 0, 0)

      // Add confidence score
      pdf.setFontSize(11)
      pdf.setFont(undefined, "normal")
      pdf.text(
        `Confiance: ${(result.confidence_score * 100).toFixed(1)}% - Statut: ${result.status}`,
        margin,
        yPosition
      )
      yPosition += 10

      // Add predictions
      pdf.setFontSize(11)
      pdf.setFont(undefined, "bold")
      pdf.text("Prédictions (Top-3)", margin, yPosition)
      yPosition += 7

      pdf.setFontSize(9)
      pdf.setFont(undefined, "normal")
      result.top_k.forEach((pred, index) => {
        const pct = (pred.score * 100).toFixed(1)
        pdf.text(
          `${index + 1}. ${pred.class_name}: ${pct}%`,
          margin + 5,
          yPosition
        )
        yPosition += 5
      })
      yPosition += 5

      // Add summary
      pdf.setFontSize(11)
      pdf.setFont(undefined, "bold")
      pdf.text("Résumé de l'Analyse", margin, yPosition)
      yPosition += 7

      pdf.setFontSize(10)
      pdf.setFont(undefined, "normal")
      const summaryLines = pdf.splitTextToSize(result.summary, contentWidth)
      pdf.text(summaryLines, margin, yPosition)
      yPosition += summaryLines.length * 4 + 5

      // Check if we need to add a new page
      if (yPosition > pageHeight - margin - 40) {
        pdf.addPage()
        yPosition = margin
      }

      // Add treatment
      pdf.setFontSize(11)
      pdf.setFont(undefined, "bold")
      pdf.setTextColor(0, 102, 204)
      pdf.text("Traitement Recommandé", margin, yPosition)
      yPosition += 7

      pdf.setFontSize(10)
      pdf.setFont(undefined, "normal")
      pdf.setTextColor(0, 0, 0)
      const treatmentLines = pdf.splitTextToSize(result.treatment, contentWidth)
      pdf.text(treatmentLines, margin, yPosition)
      yPosition += treatmentLines.length * 4 + 10

      // Add footer with model info
      pdf.setFontSize(8)
      pdf.setFont(undefined, "normal")
      pdf.setTextColor(120, 120, 120)
      pdf.text(
        `Modèle v${result.model_version} | Temps d'inférence: ${result.inference_time}`,
        margin,
        pageHeight - 10
      )

      // Generate filename
      const filename = `rapport_diagnostic_${now.toISOString().split("T")[0]}_${now.getHours()}${now.getMinutes()}.pdf`

      // Save or download
      pdf.save(filename)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Erreur lors de l'export du rapport")
    }
  }, [result, preview])

  const handleReset = () => {
    setStatus("idle")
    setPreview(null)
    setResult(null)
    setProgress(0)
    setErrorMessage(null)
    setCurrentFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <section
      className="relative px-4 py-12 md:px-6 md:py-20 transition-colors duration-300"
      style={theme === "light" ? { backgroundColor: colors.bg } : undefined}
    >
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full blur-3xl"
          style={
            theme === "light"
              ? { backgroundColor: colors.primary + "20" }
              : { backgroundColor: "#ADE1F7" + "12" }
          }
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header with theme toggle */}
        <div className="mb-12 text-center md:mb-16">
          {/* Theme toggle buttons */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setTheme("dark")}
              className="p-2 rounded-lg transition-all"
              style={
                theme === "dark"
                  ? {
                      backgroundColor: colors.primary,
                      color: "#0A0E27",
                    }
                  : {
                      backgroundColor: "#F0F0F0",
                      color: "#333",
                    }
              }
              title="Dark mode"
            >
              <Moon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme("light")}
              className="p-2 rounded-lg transition-all"
              style={
                theme === "light"
                  ? {
                      backgroundColor: colors.primary,
                      color: "#FFF",
                    }
                  : {
                      backgroundColor: "#F0F0F0",
                      color: "#666",
                    }
              }
              title="Light mode"
            >
              <Sun className="h-5 w-5" />
            </button>
          </div>

          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={
              theme === "light"
                ? {
                    borderColor: colors.primary + "33",
                    backgroundColor: colors.primary + "11",
                  }
                : undefined
            }
          >
            <Sparkles
              className={theme === "dark" ? "h-3.5 w-3.5 text-[#ADE1F7]" : "h-3.5 w-3.5"}
              style={theme === "light" ? { color: colors.primary } : undefined}
            />
            <span
              className={
                theme === "dark"
                  ? "text-xs font-medium tracking-wide text-[#ADE1F7]"
                  : "text-xs font-medium tracking-wide"
              }
              style={theme === "light" ? { color: colors.primary } : undefined}
            >
              Moteur de vision IA
            </span>
          </div>
          <h1
            className="text-balance text-3xl font-bold tracking-tight md:text-5xl"
            style={theme === "light" ? { color: colors.text } : undefined}
          >
            Surveillez la santé de vos cultures avec AGILICIS
          </h1>
          <p
            className={theme === "dark" ? "mx-auto mt-4 max-w-lg text-pretty text-muted-foreground leading-relaxed" : "mx-auto mt-4 max-w-lg text-pretty leading-relaxed"}
            style={theme === "light" ? { color: colors.textMuted } : undefined}
          >
            Chargez une photo pour analyser les symptomes et obtenir un diagnostic avec traitement recommande.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          {/* Left: Upload panel (2/5) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              className={
                theme === "dark"
                  ? `group relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      isDragOver
                        ? "border-[#ADE1F7] bg-[#ADE1F7]/5 scale-[1.01]"
                        : preview
                          ? "border-border bg-card"
                          : "border-border bg-card hover:border-[#ADE1F7]/30 hover:bg-[#ADE1F7]/[0.02]"
                    }`
                  : "group relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300"
              }
              style={
                theme === "light"
                  ? {
                      borderColor: isDragOver ? colors.primary : colors.border,
                      backgroundColor: preview
                        ? colors.bgCard
                        : isDragOver
                          ? colors.primary + "11"
                          : colors.bg,
                    }
                  : undefined
              }
              role="button"
              tabIndex={0}
              onClick={() => {
                if (status === "idle") {
                  fileInputRef.current?.click()
                }
              }}
              onKeyDown={(e) => {
                if (status === "idle" && (e.key === "Enter" || e.key === " ")) {
                  fileInputRef.current?.click()
                }
              }}
            >
              {preview ? (
                <div className="relative h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Image chargee pour analyse"
                    className="h-full max-h-[340px] w-full rounded-xl object-contain p-3"
                  />
                  {status === "done" && (
                    <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-card/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                     
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 p-8">
                  <div
                    className={theme === "dark" ? "flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ADE1F7]/10 transition-colors group-hover:bg-[#ADE1F7]/20" : "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors"}
                    style={
                      theme === "light"
                        ? {
                            backgroundColor: "#0066CC" + "22",
                          }
                        : undefined
                    }
                  >
                    <ImageIcon
                      className={theme === "dark" ? "h-7 w-7 text-[#ADE1F7]" : "h-7 w-7"}
                      style={theme === "light" ? { color: "#0066CC"} : undefined}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className={theme === "dark" ? "text-sm font-medium text-foreground" : "text-sm font-medium"}
                      style={theme === "light" ? { color: colors.text } : undefined}
                    >
                      Glissez une image ici
                    </p>
                    <p
                      className={theme === "dark" ? "mt-1.5 text-xs text-muted-foreground" : "mt-1.5 text-xs"}
                      style={theme === "light" ? { color: colors.textMuted } : undefined}
                    >
                      ou cliquez pour parcourir
                    </p>
                    <p
                      className={theme === "dark" ? "mt-3 text-[11px] text-muted-foreground/60" : "mt-3 text-[11px]"}
                      style={theme === "light" ? { color: colors.textMuted + "99" } : undefined}
                    >
                      JPG, PNG, WEBP
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileInput}
                disabled={status !== "idle"}
              />
            </div>

            {/* Progress and Error */}
            {status === "uploading" || status === "analyzing" ? (
              <div
                className={theme === "dark" ? "rounded-xl border border-border bg-card p-4" : "rounded-xl border p-4"}
                style={
                  theme === "light"
                    ? {
                        borderColor: colors.border,
                        backgroundColor: colors.bgCard,
                      }
                    : undefined
                }
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span
                    className={theme === "dark" ? "flex items-center gap-2 text-muted-foreground" : "flex items-center gap-2"}
                    style={theme === "light" ? { color: colors.textMuted } : undefined}
                  >
                    <Loader2
                      className={theme === "dark" ? "h-3.5 w-3.5 animate-spin text-[#ADE1F7]" : "h-3.5 w-3.5 animate-spin"}
                      style={theme === "light" ? { color: colors.primary } : undefined}
                    />
                    {status === "uploading"
                      ? "Envoi de l'image..."
                      : "Analyse IA en cours..."}
                  </span>
                  <span
                    className={theme === "dark" ? "font-mono text-xs font-medium text-foreground" : "font-mono text-xs font-medium"}
                    style={theme === "light" ? { color: colors.text } : undefined}
                  >
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            ) : null}

            {/* Error Alert */}
            {status === "error" && errorMessage && (
              <div
                className={theme === "dark" ? "flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive" : "flex items-center gap-3 rounded-xl border p-4"}
                style={
                  theme === "light"
                    ? {
                        borderColor: "#FFCDD2",
                        backgroundColor: "#FFEBEE",
                        color: "#C62828",
                      }
                    : undefined
                }
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Reset button on mobile */}
            {(status === "done" || status === "error") && (
            <Button
            variant="outline"
            onClick={handleReset}
            className={
            theme === "dark"
            ? // Dark mode
            "w-full lg:hidden bg-[#ADE1F7]/90 hover:bg-[#7ECFE8] text-[#0A0E27] transition-all duration-200"
            : // Light mode
            "w-full lg:hidden bg-[#0066CC] hover:bg-[#0052A3] text-white transition-all duration-200"
            }
             >
            <RotateCcw className="h-4 w-4" />
            Nouvelle analyse
            </Button>
            )}

            

            {/* Info cards */}
            <div className="hidden grid-cols-2 gap-3 lg:grid">
              <div
                className={theme === "dark" ? "flex items-start gap-3 rounded-xl border border-border bg-card p-3.5" : "flex items-start gap-3 rounded-xl border p-3.5 "}
                style={
                  theme === "light"
                    ? {
                        borderColor: colors.border,
                        backgroundColor: colors.bgCard,
                      }
                    : undefined
                }
              >
                <div
                  className={theme === "dark" ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ADE1F7]/10" : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"}
                  style={
                    theme === "light"
                      ? {
                          backgroundColor: colors.primary + "22",
                        }
                      : undefined
                  }
                >
                  <Shield
                    className={theme === "dark" ? "h-4 w-4 text-[#ADE1F7]" : "h-4 w-4"}
                    style={theme === "light" ? { color: colors.primary } : undefined}
                  />
                </div>
                <div>
                  <p className={theme === "dark" ? "text-xs font-medium text-foreground" : "text-xs font-medium"} style={theme === "light" ? { color: colors.text } : undefined}>Securise</p>
                  <p className={theme === "dark" ? "mt-0.5 text-[11px] text-muted-foreground leading-relaxed" : "mt-0.5 text-[11px] leading-relaxed"} style={theme === "light" ? { color: colors.textMuted } : undefined}>
                    Donnees chiffrees et non conservees
                  </p>
                </div>
              </div>
              <div
                className={theme === "dark" ? "flex items-start gap-3 rounded-xl border border-border bg-card p-3.5" : "flex items-start gap-3 rounded-xl border p-3.5"}
                style={
                  theme === "light"
                    ? {
                        borderColor: colors.border,
                        backgroundColor: colors.bgCard,
                      }
                    : undefined
                }
              >
                <div
                  className={theme === "dark" ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ADE1F7]/10" : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"}
                  style={
                    theme === "light"
                      ? {
                          backgroundColor: colors.primary + "22",
                        }
                      : undefined
                  }
                >
                  <Activity
                    className={theme === "dark" ? "h-4 w-4 text-[#ADE1F7]" : "h-4 w-4"}
                    style={theme === "light" ? { color: "#0066CC" } : undefined}
                  />
                </div>
                <div>
                  <p className={theme === "dark" ? "text-xs font-medium text-foreground" : "text-xs font-medium"} style={theme === "light" ? { color: colors.text } : undefined}>Rapide</p>
                  <p className={theme === "dark" ? "mt-0.5 text-[11px] text-muted-foreground leading-relaxed" : "mt-0.5 text-[11px] leading-relaxed"} style={theme === "light" ? { color: colors.textMuted } : undefined}>
                    {"Resultat en < 2 secondes"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results panel (3/5) */}
          <div className="lg:col-span-3">
            {status === "idle" && (
              <div
                className={theme === "dark" ? "flex h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center" : "flex h-[340px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center"}
                style={
                  theme === "light"
                    ? {
                        borderColor: colors.border,
                        backgroundColor: colors.primary + "08",
                      }
                    : undefined
                }
              >
                <div
                  className={theme === "dark" ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary" : "flex h-14 w-14 items-center justify-center rounded-2xl"}
                  style={
                    theme === "light"
                      ? {
                          backgroundColor: colors.bgCard,
                        }
                      : undefined
                  }
                >
                  <Upload
                    className={theme === "dark" ? "h-6 w-6 text-muted-foreground" : "h-6 w-6"}
                    style={theme === "light" ? { color: colors.textMuted } : undefined}
                  />
                </div>
                <p
                  className={theme === "dark" ? "mt-5 text-sm font-medium text-foreground" : "mt-5 text-sm font-medium"}
                  style={theme === "light" ? { color: colors.text } : undefined}
                >
                  Aucune image analysee
                </p>
                <p
                  className={theme === "dark" ? "mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed" : "mt-1.5 max-w-xs text-xs leading-relaxed"}
                  style={theme === "light" ? { color: colors.textMuted } : undefined}
                >
                  Chargez une image sur la gauche pour obtenir les resultats du diagnostic IA
                </p>
              </div>
            )}

            {(status === "uploading" || status === "analyzing") && (
              <div
                className={theme === "dark" ? "flex h-[340px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8" : "flex h-[340px] flex-col items-center justify-center rounded-2xl border p-8"}
                style={
                  theme === "light"
                    ? {
                        borderColor: colors.border,
                        backgroundColor: colors.bgCard,
                      }
                    : undefined
                }
              >
                <div className="relative">
                  <div
                    className={theme === "dark" ? "absolute inset-0 animate-ping rounded-full bg-[#ADE1F7]/20" : "absolute inset-0 animate-ping rounded-full"}
                    style={
                      theme === "light"
                        ? {
                            backgroundColor: "#0066CC" + "33",
                          }
                        : undefined
                    }
                  />
                  <div
                    className={theme === "dark" ? "relative flex h-14 w-14 items-center justify-center rounded-full bg-[#ADE1F7]/10" : "relative flex h-14 w-14 items-center justify-center rounded-full"}
                    style={
                      theme === "light"
                        ? {
                            backgroundColor: "#0066CC" + "22",
                          }
                        : undefined
                    }
                  >
                    <Loader2
                      className={theme === "dark" ? "h-6 w-6 animate-spin text-[#ADE1F7]" : "h-6 w-6 animate-spin"}
                      style={theme === "light" ? { color: "#0066CC" } : undefined}
                    />
                  </div>
                </div>
                <p
                  className={theme === "dark" ? "mt-6 text-sm font-medium text-foreground" : "mt-6 text-sm font-medium"}
                  style={theme === "light" ? { color: "#0066CC" } : undefined}
                >
                  {status === "uploading"
                    ? "Envoi au serveur..."
                    : "Le modele analyse l'image..."}
                </p>
                <p
                  className={theme === "dark" ? "mt-1 text-xs text-muted-foreground" : "mt-1 text-xs"}
                  style={theme === "light" ? { color: "#0066CC" } : undefined}
                >
                  {status === "analyzing"
                    ? "Classification, extraction des symptomes, correlation..."
                    : "Preparation du pipeline d'inference..."}
                </p>
              </div>
            )}

            {status === "done" && result && (
              <div className="flex flex-col gap-4">
                {/* Main result card */}
                <div
                  className={theme === "dark" ? "overflow-hidden rounded-2xl border border-border bg-card" : "overflow-hidden rounded-2xl border"}
                  style={
                    theme === "light"
                      ? {
                          borderColor: colors.border,
                          backgroundColor: colors.bgCard,
                        }
                      : undefined
                  }
                >
                  {/* Top bar */}
                  <div
                    className={theme === "dark" ? "flex items-center justify-between border-b border-border px-5 py-3" : "flex items-center justify-between border-b px-5 py-3"}
                    style={
                      theme === "light"
                        ? {
                            borderColor: colors.border,
                          }
                        : undefined
                    }
                  >
                    <div
                      className={theme === "dark" ? "flex items-center gap-2 text-xs text-muted-foreground" : "flex items-center gap-2 text-xs"}
                      style={theme === "light" ? { color: colors.textMuted } : undefined}
                    >
                      <Activity className="h-3.5 w-3.5" />
                      <span>
                        Modele {result.model_version}
                      </span>
                      <span
                        className={theme === "dark" ? "text-border" : ""}
                        style={theme === "light" ? { color: colors.border } : undefined}
                      >
                        |
                      </span>
                      <span>{result.inference_time}</span>
                    </div>
                    <StatusBadge status={result.status} theme={theme} />
                  </div>

                  {/* Prediction */}
                  <div className="p-5">
                    <p
                      className={theme === "dark" ? "text-[11px] font-medium uppercase tracking-widest text-muted-foreground" : "text-[11px] font-medium uppercase tracking-widest"}
                      style={theme === "light" ? { color: colors.textMuted } : undefined}
                    >
                      Maladie detectee
                    </p>
                    <p
                      className={theme === "dark" ? "mt-1.5 text-2xl font-bold tracking-tight text-foreground" : "mt-1.5 text-2xl font-bold tracking-tight"}
                      style={theme === "light" ? { color: colors.text } : undefined}
                    >
                      {result.predicted_class}
                    </p>

                    {/* Confidence bars */}
                    <div className="mt-6 flex flex-col gap-3">
                      <p
                        className={theme === "dark" ? "text-[11px] font-medium uppercase tracking-widest text-muted-foreground" : "text-[11px] font-medium uppercase tracking-widest"}
                        style={theme === "light" ? { color: colors.textMuted } : undefined}
                      >
                        Predictions
                      </p>
                      {result.top_k.map((pred, i) => (
                        <ConfidenceBar
                          key={pred.class_name}
                          score={pred.score}
                          label={pred.class_name}
                          isMain={i === 0}
                          theme={theme}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Diagnostic report */}
                <div
                  className={
                    theme === "dark"
                      ? "overflow-hidden rounded-2xl border border-[#ADE1F7]/15 bg-[#ADE1F7]/[0.03]"
                      : "overflow-hidden rounded-2xl border"
                  }
                  style={
                    theme === "light"
                      ? {
                          borderColor: colors.primary + "33",
                          backgroundColor: colors.primary + "11",
                        }
                      : undefined
                  }
                >
                  <div
                    className={
                      theme === "dark"
                        ? "flex items-center gap-2 border-b border-[#ADE1F7]/10 px-5 py-3"
                        : "flex items-center gap-2 border-b px-5 py-3"
                    }
                    style={
                      theme === "light"
                        ? {
                            borderColor: colors.primary + "22",
                          }
                        : undefined
                    }
                  >
                    <FileText
                      className={theme === "dark" ? "h-3.5 w-3.5 text-[#ADE1F7]" : "h-3.5 w-3.5"}
                      style={theme === "light" ? { color: colors.primary } : undefined}
                    />
                    <span
                      className={theme === "dark" ? "text-xs font-medium text-[#ADE1F7]" : "text-xs font-medium"}
                      style={theme === "light" ? { color: colors.primary } : undefined}
                    >
                      Rapport diagnostique
                    </span>
                  </div>
                  <div className="p-5">
                    <p
                      className={theme === "dark" ? "text-sm leading-relaxed text-foreground" : "text-sm leading-relaxed"}
                      style={theme === "light" ? { color: colors.text } : undefined}
                    >
                      {result.summary}
                    </p>
                    <div
                      className={
                        theme === "dark"
                          ? "mt-4 flex items-start gap-3 rounded-xl bg-[#ADE1F7]/5 p-4"
                          : "mt-4 flex items-start gap-3 rounded-xl p-4"
                      }
                      style={
                        theme === "light"
                          ? {
                              backgroundColor: "#0066CC" + "15",
                            }
                          : undefined
                      }
                    >
                      <ChevronRight
                        className={theme === "dark" ? "mt-0.5 h-4 w-4 shrink-0 text-[#ADE1F7]" : "mt-0.5 h-4 w-4 shrink-0"}
                        style={theme === "light" ? { color: "#0066CC" } : undefined}
                      />
                      <div>
                        <p
                          className={
                            theme === "dark"
                              ? "text-xs font-semibold uppercase tracking-wider text-[#ADE1F7]"
                              : "text-xs font-semibold uppercase tracking-wider"
                          }
                          style={theme === "light" ? { color: "#0066CC" } : undefined}
                        >
                          Traitement recommande
                        </p>
                        <p
                          className={theme === "dark" ? "mt-1.5 text-sm leading-relaxed text-secondary-foreground" : "mt-1.5 text-sm leading-relaxed"}
                          style={theme === "light" ? { color: colors.text } : undefined}
                        >
                          {result.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex gap-3">
                  <Button
                  variant="outline"
                  onClick={handleReset}
                  className={
                  theme === "dark"
                  ? "flex-1 bg-[#ADE1F7]/10 hover:bg-[#ADE1F7]/20 text-[#ADE1F7] border-[#ADE1F7]/30"
                 : "flex-1"
                 }
                  style={
                  theme === "light"
                 ?   {
                      backgroundColor: "#ADE1F710",
                      color: "#0066CC",
                      borderColor: "#ADE1F730",
                    }
                   : {}
                  }
                  onMouseEnter={(e) => {
                  if (theme === "light") {
                 e.currentTarget.style.backgroundColor = "#0052A3" 
                  e.currentTarget.style.color = "#000000"
                 }
                 }}
                  onMouseLeave={(e) => {
                 if (theme === "light") {
                 e.currentTarget.style.backgroundColor = "#ADE1F730"
                 e.currentTarget.style.color = "#0066CC"
                }
                }}
                >
                   
                  <RotateCcw className="h-4 w-4" />
                   Nouvelle analyse
                  </Button>
                  <Button 
                    onClick={handleExport}
                    style={
                      theme === "light"
                        ? {
                            backgroundColor: colors.primary,
                            color: "#FFF",
                            borderColor: colors.primary,
                          }
                        : undefined
                    }
                    className={theme === "dark" ? "flex-1 bg-[#ADE1F7] hover:bg-[#ADE1F7]/90 text-[#0A2540] border-[#ADE1F7]/50" : "flex-1"}
                  >
                    <Download className="h-4 w-4 " />
                    Exporter le rapport
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
