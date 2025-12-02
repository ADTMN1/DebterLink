import { Button } from "@/components/ui/button";
import { LandingHero } from "@/components/LandingHero";
import { LandingFeatures } from "@/components/LandingFeatures";
// Topbar provides ThemeToggle and LanguageSwitcher globally
import { GraduationCap, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Topbar handles header and controls globally (LanguageSwitcher / ThemeToggle / auth buttons) */}

      <main>
        <LandingHero />
        <LandingFeatures />
        
        <div className="py-12 bg-gradient-to-br from-primary/5 to-chart-2/5">
          <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
            <h2 className="font-serif text-3xl font-bold lg:text-4xl">
              Ready to Transform Your School?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of Ethiopian schools already using ደብተርLink to improve 
              student outcomes and streamline operations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Button size="lg" data-testid="button-start-free-trial">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" data-testid="button-schedule-demo">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ደብተርLink – Smart Education Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
