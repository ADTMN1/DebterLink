import {
  ClipboardList,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Calendar,
  Brain,
  Globe,
  Zap,
  Users,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const featureKeys = [
  "smartAttendance",
  "assignmentManagement",
  "parentTeacherHub",
  "gradeAnalytics",
  "aiPredictions",
  "behaviorTracking",
  "appealSystem",
  "resourceLibrary",
  "dualCalendar",
  "multiSchoolSupport",
  "offlineMode",
  "roleBasedAccess",
];

const featureIcons = [
  ClipboardList,
  FileText,
  MessageSquare,
  BarChart3,
  Brain,
  Shield,
  AlertCircle,
  BookOpen,
  Calendar,
  Globe,
  Zap,
  Users,
];

const featureColors = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-chart-1",
  "text-chart-2",
];

export function LandingFeatures() {
  const { t } = useTranslation();

  const features = featureKeys.map((key, index) => ({
    icon: featureIcons[index],
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
    color: featureColors[index],
  }));

  return (
    <div className="py-8 bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-4">
          <h2 className="font-serif text-3xl font-bold lg:text-4xl mb-4">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("landing.featuresSubtitle")}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
