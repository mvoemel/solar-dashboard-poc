import { Suspense } from "react";
import { ThemeToggle } from "@/components/global/theme-toggle";
import { Loader2Icon } from "lucide-react";
import { SolarDashboardWrapper } from "@/components/solar-dashboard";

export default async function Home() {
  return (
    <main className="min-h-screen p-4">
      <Suspense fallback={<Loader2Icon className="size-16 animate-spin" />}>
        <SolarDashboardWrapper />
      </Suspense>

      <ThemeToggle />
    </main>
  );
}
