import { Suspense } from "react";
import { SolarDashboard } from "@/components/solar-dashboard/solar-dashboard";
import { ThemeToggle } from "@/components/global/theme-toggle";
import { Loader2Icon } from "lucide-react";

export default async function Home() {
  return (
    <main className="min-h-screen p-4">
      <Suspense fallback={<Loader2Icon className="size-16 animate-spin" />}>
        <SolarDashboard />
      </Suspense>

      <ThemeToggle />
    </main>
  );
}
