import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, BarChart3, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from '../../attached_assets/generated_images/ethiopian_students_using_technology_classroom.png';
export function LandingHero() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-2">
          {/* reduced vertical spacing between the badge/title/other elements */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">Modern Education Management</span>
            </div>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-6xl">
              {t("landing.title")}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              {t("landing.subtitle")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group" data-testid="button-get-started">
                {t("landing.getStarted")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                {t("landing.learnMore")}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-4 border-t">
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <Users className="h-5 w-5 text-primary" />
                  50K+
                </div>
                <p className="text-sm text-muted-foreground mt-1">Active Users</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <GraduationCap className="h-5 w-5 text-chart-2" />
                  200+
                </div>
                <p className="text-sm text-muted-foreground mt-1">Schools</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <BarChart3 className="h-5 w-5 text-chart-4" />
                  98%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 rounded-lg" />
            <img
              src={heroImage}
              alt="Ethiopian students using technology in classroom"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
