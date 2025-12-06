import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "./router/protected-route";
import { Role } from "@/types";

import LoginPage from "@/pages/auth/login";
import NotFound from "@/pages/not-found";

// Dashboards
import StudentDashboard from "@/pages/dashboard/student-dashboard";
import StudentGrades from "@/pages/dashboard/student-grades";
import TeacherDashboard from "@/pages/dashboard/teacher-dashboard";
import ParentDashboard from "@/pages/dashboard/parent-dashboard";
import DirectorDashboard from "@/pages/dashboard/director-dashboard";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";

// Features
// import AttendancePage from "@/features/attendance/attendance-page";
import { AttendancePage } from "@/pages/dashboard/attendance-page";
import { ResultsPage } from "@/pages/dashboard/results-page";
import AssignmentsPage from "@/features/assignments/assignments-page";
import MessagingPage from "@/features/messaging/messaging-page";
import CalendarPage from "@/features/calendar/calendar-page";
import ResourcesPage from "@/features/resources/resources-page";
import AppealsPage from "@/features/appeals/appeals-page";
import TimetablePage from "@/features/timetable/timetable-page";
import { useAuthStore } from "@/store/useAuthStore";

import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ProfilePage from "@/pages/profile/profile-page";
import SettingsPage from "@/pages/settings-page";
import BehaviorPage from "@/features/behavior/behavior-page";
import { BehaviorAnalyticsPage } from "@/pages/dashboard/behavior-analytics-page";
import GradebookPage from "@/features/grades/gradebook-page";
import UsersPage from "@/features/admin/users-page";
import SchoolsPage from "@/features/admin/schools-page";
import SalaryPage from "@/features/finance/salary-page";
import ReportsPage from "@/features/reports/reports-page";
import AuditPage from "@/pages/audit-page";
import BackupPage from "@/features/backup/backup-page";
import LandingPage from "@/pages/landing-page";
import ClassesPage from "@/features/classes/classes-page";
import SubjectsPage from "@/features/subjects/subjects-page";

function Router() {
  const { user } = useAuthStore();

  // Simple role-based dashboard redirect
  const getDashboard = () => {
    switch (user?.role) {
      case 'student': return StudentDashboard;
      case 'teacher': return TeacherDashboard;
      case 'parent': return ParentDashboard;
      case 'director': return DirectorDashboard;
      case 'admin': return AdminDashboard;
      case 'super_admin': return AdminDashboard;
      default: return StudentDashboard;
    }
  };

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/landing" component={LandingPage} />

      {/* Protected Routes with Role-Based Access */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={getDashboard()} />}
      </Route>

      <Route path="/profile">
        {() => <ProtectedRoute component={ProfilePage} />}
      </Route>

      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} />}
      </Route>

      {/* Student Routes */}
      <Route path="/grades">
        {() => <ProtectedRoute component={StudentGrades} allowedRoles={['student', 'parent']} />}
      </Route>

      <Route path="/dashboard/attendance">
        {() => <ProtectedRoute component={AttendancePage} allowedRoles={['student', 'teacher', 'parent', 'director']} />}
      </Route>

      <Route path="/dashboard/results">
        {() => <ProtectedRoute component={ResultsPage} allowedRoles={['director']} />}
      </Route>

      <Route path="/assignments">
        {() => <ProtectedRoute component={AssignmentsPage} allowedRoles={['student', 'teacher']} />}
      </Route>


      <Route path="/gradebook">
        {() => <ProtectedRoute component={GradebookPage} allowedRoles={['teacher']} />}
      </Route>

      <Route path="/behavior">
        {() => <ProtectedRoute component={BehaviorPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>
      <Route path="/dashboard/behavior-analytics">
        {() => <ProtectedRoute component={BehaviorAnalyticsPage} allowedRoles={['director']} />}
      </Route>

      <Route path="/calendar">
        {() => <ProtectedRoute component={CalendarPage} allowedRoles={['student', 'parent', 'teacher', 'director', 'admin']} />}
      </Route>

      <Route path="/resources">
        {() => <ProtectedRoute component={ResourcesPage} allowedRoles={['student', 'teacher', 'director']} />}
      </Route>

      <Route path="/appeals">
        {() => <ProtectedRoute component={AppealsPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      <Route path="/timetable">
        {() => <ProtectedRoute component={TimetablePage} allowedRoles={['director']} />}
      </Route>

      {/* Communication Routes */}
      <Route path="/messaging">
        {() => <ProtectedRoute component={MessagingPage} allowedRoles={['student', 'parent', 'teacher', 'director']} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/users">
        {() => <ProtectedRoute component={UsersPage} allowedRoles={['admin', 'super_admin', 'director']} />}
      </Route>

      <Route path="/schools">
        {() => <ProtectedRoute component={SchoolsPage} allowedRoles={['super_admin']} />}
      </Route>

      {/* Finance Routes */}
      <Route path="/salary">
        {() => <ProtectedRoute component={SalaryPage} allowedRoles={['teacher', 'director']} />}
      </Route>

      {/* Reports - Director/Admin only */}
      <Route path="/reports">
        {() => <ProtectedRoute component={ReportsPage} allowedRoles={['director', 'admin', 'super_admin']} />}
      </Route>

      {/* Audit - Admin only */}
      <Route path="/audit">
        {() => <ProtectedRoute component={AuditPage} allowedRoles={['admin', 'super_admin']} />}
      </Route>

      {/* Backup - Super Admin only */}
      <Route path="/backup">
        {() => <ProtectedRoute component={BackupPage} allowedRoles={['super_admin']} />}
      </Route>

      {/* Director Routes */}
      <Route path="/classes">
        {() => <ProtectedRoute component={ClassesPage} allowedRoles={['director']} />}
      </Route>

      <Route path="/subjects">
        {() => <ProtectedRoute component={SubjectsPage} allowedRoles={['director']} />}
      </Route>


      {/* Redirect root to dashboard if logged in, else landing */}
      <Route path="/">
        {() => <Redirect to={user ? "/dashboard" : "/landing"} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
