import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { Announcer } from "@/components/ui/announcer";
import { ProtectedRoute } from "./router/protected-route";
import { useAuthStore } from "@/store/useAuthStore";
import { PageTransition } from "@/components/ui/page-transition";
import { initializeGlobalSanitization } from "@/lib/sanitization-middleware";
import { ErrorBoundary } from "@/components/error-boundary";
import { FullPageLoader } from "@/components/ui/loading-states";
import { useNetworkStatus } from "@/hooks/use-network-status";

// Critical pages - load immediately
import LandingPage from "@/pages/landing-page";
import LoginPage from "@/pages/auth/login";
import NotFound from "@/pages/not-found";

// Auth pages
const RegisterPage = lazy(() => import("@/pages/auth/register"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/reset-password"));

// Dashboard pages
const StudentDashboard = lazy(
  () => import("@/pages/dashboard/student-dashboard")
);
const TeacherDashboard = lazy(
  () => import("@/pages/dashboard/teacher-dashboard")
);
const ParentDashboard = lazy(
  () => import("@/pages/dashboard/parent-dashboard")
);
const DirectorDashboard = lazy(
  () => import("@/pages/dashboard/director-dashboard")
);
const AdminDashboard = lazy(() => import("@/pages/dashboard/admin-dashboard"));

// Feature pages
const StudentGrades = lazy(() => import("@/pages/dashboard/student-grades"));
const AttendancePage = lazy(() =>
  import("@/pages/dashboard/attendance-page").then((m) => ({
    default: m.AttendancePage,
  }))
);
const ResultsPage = lazy(() =>
  import("@/pages/dashboard/results-page").then((m) => ({
    default: m.ResultsPage,
  }))
);
const ProfilePage = lazy(() => import("@/pages/profile/profile-page"));
const SettingsPage = lazy(() => import("@/pages/settings-page"));
const BehaviorAnalyticsPage = lazy(() =>
  import("@/pages/dashboard/behavior-analytics-page").then((m) => ({
    default: m.BehaviorAnalyticsPage,
  }))
);

// Feature modules
const AssignmentsPage = lazy(
  () => import("@/features/assignments/assignments-page")
);
const MessagingPage = lazy(() => import("@/features/messaging/messaging-page"));
const CalendarPage = lazy(() => import("@/features/calendar/calendar-page"));
const ResourcesPage = lazy(() => import("@/features/resources/resources-page"));
const AppealsPage = lazy(() => import("@/features/appeals/appeals-page"));
const TimetablePage = lazy(() => import("@/features/timetable/timetable-page"));
const BehaviorPage = lazy(() => import("@/features/behavior/behavior-page"));
const GradebookPage = lazy(() => import("@/features/grades/gradebook-page"));
const UsersPage = lazy(() => import("@/features/admin/users-page"));
const SchoolsPage = lazy(() => import("@/features/admin/schools-page"));
const SalaryPage = lazy(() => import("@/features/finance/salary-page"));
const ReportsPage = lazy(() => import("@/features/reports/reports-page"));
const AuditPage = lazy(() => import("@/pages/audit-page"));
const BackupPage = lazy(() => import("@/features/backup/backup-page"));
const ClassesPage = lazy(() => import("@/features/classes/classes-page"));
const SubjectsPage = lazy(() => import("@/features/subjects/subjects-page"));

import { LoadingSpinner } from "@/components/loading-spinner";

function Router() {
  const { user } = useAuthStore();
  const [location] = useLocation();

  const getDashboard = () => {
    switch (user?.role) {
      case "student":
        return StudentDashboard;
      case "teacher":
        return TeacherDashboard;
      case "parent":
        return ParentDashboard;
      case "director":
        return DirectorDashboard;
      case "admin":
      case "super_admin":
        return AdminDashboard;
      default:
        return StudentDashboard;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/landing" component={LandingPage} />

      {/* Protected Routes with Role-Based Access */}
      <Route path="/dashboard">
        {() => <PageTransition><ProtectedRoute component={getDashboard()} /></PageTransition>}
      </Route>

      <Route path="/profile">
        {() => <ProtectedRoute component={ProfilePage} />}
      </Route>

      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} />}
      </Route>

      {/* Student Routes */}
      <Route path="/grades">
        {() => (
          <ProtectedRoute
            component={StudentGrades}
            allowedRoles={["student", "parent"]}
          />
        )}
      </Route>

      <Route path="/dashboard/attendance">
        {() => (
          <ProtectedRoute
            component={AttendancePage}
            allowedRoles={["student", "teacher", "parent", "director"]}
          />
        )}
      </Route>

      <Route path="/dashboard/results">
        {() => (
          <ProtectedRoute component={ResultsPage} allowedRoles={["director"]} />
        )}
      </Route>

      <Route path="/dashboard/assignments">
        {() => <ProtectedRoute component={AssignmentsPage} allowedRoles={['student', 'teacher', 'director']} />}
      </Route>

      <Route path="/dashboard/grades">
        {() => <ProtectedRoute component={StudentGrades} allowedRoles={['student', 'parent']} />}
      </Route>

      <Route path="/dashboard/gradebook">
        {() => <ProtectedRoute component={GradebookPage} allowedRoles={['teacher', 'director']} />}
      </Route>

      <Route path="/dashboard/behavior">
        {() => <ProtectedRoute component={BehaviorPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>
      <Route path="/dashboard/behavior-analytics">
        {() => (
          <ProtectedRoute
            component={BehaviorAnalyticsPage}
            allowedRoles={["director"]}
          />
        )}
      </Route>

      <Route path="/appeals">
        {() => <ProtectedRoute component={AppealsPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      <Route path="/messaging">
        {() => <ProtectedRoute component={MessagingPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      <Route path="/behavior">
        {() => <ProtectedRoute component={BehaviorPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      <Route path="/dashboard/calendar">
        {() => <ProtectedRoute component={CalendarPage} allowedRoles={['student', 'parent', 'teacher', 'director', 'admin']} />}
      </Route>

      <Route path="/dashboard/resources">
        {() => <ProtectedRoute component={ResourcesPage} allowedRoles={['student', 'teacher', 'director']} />}
      </Route>

      <Route path="/dashboard/timetable">
        {() => <ProtectedRoute component={TimetablePage} allowedRoles={['student', 'teacher', 'director']} />}
      </Route>

      {/* Communication Routes */}
      <Route path="/dashboard/messages">
        {() => <ProtectedRoute component={MessagingPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      <Route path="/dashboard/appeals">
        {() => <ProtectedRoute component={AppealsPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/dashboard/users">
        {() => <ProtectedRoute component={UsersPage} allowedRoles={['admin', 'super_admin', 'director']} />}
      </Route>

      <Route path="/schools">
        {() => (
          <ProtectedRoute
            component={SchoolsPage}
            allowedRoles={["super_admin"]}
          />
        )}
      </Route>

      {/* Finance Routes */}
      <Route path="/salary">
        {() => (
          <ProtectedRoute
            component={SalaryPage}
            allowedRoles={["teacher", "director"]}
          />
        )}
      </Route>

      {/* Reports - Director/Admin only */}
      <Route path="/reports">
        {() => (
          <ProtectedRoute
            component={ReportsPage}
            allowedRoles={["director", "admin", "super_admin"]}
          />
        )}
      </Route>

      {/* Audit - Admin only */}
      <Route path="/audit">
        {() => (
          <ProtectedRoute
            component={AuditPage}
            allowedRoles={["admin", "super_admin"]}
          />
        )}
      </Route>

      {/* Backup - Super Admin only */}
      <Route path="/backup">
        {() => (
          <ProtectedRoute
            component={BackupPage}
            allowedRoles={["super_admin"]}
          />
        )}
      </Route>

      {/* Director Routes */}
      <Route path="/classes">
        {() => (
          <ProtectedRoute component={ClassesPage} allowedRoles={["director"]} />
        )}
      </Route>

      <Route path="/subjects">
        {() => (
          <ProtectedRoute
            component={SubjectsPage}
            allowedRoles={["director"]}
          />
        )}
      </Route>

      {/* Redirect root to dashboard if logged in, else landing */}
      <Route path="/">
        {() => <Redirect to={user ? "/dashboard" : "/landing"} />}
      </Route>

      <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  useNetworkStatus(); // Monitor network status
  
  useEffect(() => {
    // Initialize global input sanitization
    initializeGlobalSanitization();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <Router />
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
