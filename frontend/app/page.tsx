import { DetectionDemo } from "@/components/detection-demo"
import Image from "next/image"
export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full  overflow-hidden">
             <Image
               src="/agilicissas_logo.jpg"
               alt="AGILICIS Logo"
               width={32}
               height={32}
               className="object-cover"
               />
               </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              AGILICIS
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              |
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              AI Disease Detection
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-medium text-muted-foreground">
              Modele actif
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <DetectionDemo />
      </div>

      <footer className="border-t border-border/40 py-4">
        <p className="text-center text-[11px] text-muted-foreground">
          AGILICIS &mdash; SAP Services, Salesforce Expertise, Digital Technology & Solutions
        </p>
      </footer>
    </main>
  )
}
