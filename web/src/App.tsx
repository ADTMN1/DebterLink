import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Topbar } from "@/components/Topbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import DirectorDashboard from "@/pages/DirectorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AttendancePage from "@/pages/AttendancePage";
import AssignmentsPage from "@/pages/AssignmentsPage";
import ExamResultsPage from "@/pages/ExamResultsPage";
import MessagingPage from "@/pages/MessagingPage";
import BehaviorPage from "@/pages/BehaviorPage";
import AppealsPage from "@/pages/AppealsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CalendarPage from "@/pages/CalendarPage";
import AIDashboardPage from "@/pages/AIDashboardPage";
import UsersPage from "@/pages/UsersPage";
import ClassesPage from "@/pages/ClassesPage";
import TimetablePage from "@/pages/TimetablePage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import SchoolsPage from "@/pages/SchoolsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

// Protected routes wrapper
function ProtectedRouteWrapper({ component: Component }: { component: React.ComponentType }) {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard/super-admin">
        <ProtectedRouteWrapper component={SuperAdminDashboard} />
      </Route>
      <Route path="/dashboard/teacher">
        <ProtectedRouteWrapper component={TeacherDashboard} />
      </Route>
      <Route path="/dashboard/student">
        <ProtectedRouteWrapper component={StudentDashboard} />
      </Route>
      <Route path="/dashboard/parent">
        <ProtectedRouteWrapper component={ParentDashboard} />
      </Route>
      <Route path="/dashboard/director">
        <ProtectedRouteWrapper component={DirectorDashboard} />
      </Route>
      <Route path="/dashboard/admin">
        <ProtectedRouteWrapper component={AdminDashboard} />
      </Route>
      
      {/* Protected Feature Routes */}
      <Route path="/attendance">
        <ProtectedRouteWrapper component={AttendancePage} />
      </Route>
      <Route path="/assignments">
        <ProtectedRouteWrapper component={AssignmentsPage} />
      </Route>
      <Route path="/grades">
        <ProtectedRouteWrapper component={ExamResultsPage} />
      </Route>
      <Route path="/messages">
        <ProtectedRouteWrapper component={MessagingPage} />
      </Route>
      <Route path="/behavior">
        <ProtectedRouteWrapper component={BehaviorPage} />
      </Route>
      <Route path="/appeals">
        <ProtectedRouteWrapper component={AppealsPage} />
      </Route>
      <Route path="/resources">
        <ProtectedRouteWrapper component={ResourcesPage} />
      </Route>
      <Route path="/calendar">
        <ProtectedRouteWrapper component={CalendarPage} />
      </Route>
      <Route path="/ai-dashboard">
        <ProtectedRouteWrapper component={AIDashboardPage} />
      </Route>
      <Route path="/users">
        <ProtectedRouteWrapper component={UsersPage} />
      </Route>
      <Route path="/classes">
        <ProtectedRouteWrapper component={ClassesPage} />
      </Route>
      <Route path="/timetable">
        <ProtectedRouteWrapper component={TimetablePage} />
      </Route>
      <Route path="/settings">
        <ProtectedRouteWrapper component={SettingsPage} />
      </Route>
      <Route path="/schools">
        <ProtectedRouteWrapper component={SchoolsPage} />
      </Route>
      <Route path="/analytics">
        <ProtectedRouteWrapper component={AnalyticsPage} />
      </Route>
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Topbar />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
