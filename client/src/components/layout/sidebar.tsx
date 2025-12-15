import { memo } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/ui/logo';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  GraduationCap,
  ClipboardCheck,
  AlertCircle,
  Library,
  Clock,
  BarChart3,
  ThumbsUp,
  FileEdit,
  School,
  DollarSign,
  ChevronDown,
  UsersRound,
  BookMarked,
  Award,
  TrendingUp,
  ClipboardList,
  FileBarChart,
  Shield,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Role } from '@/types';

export const Sidebar = memo(function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { t } = useTranslation();
  const [location] = useLocation();

  const role = user?.role || 'student';

  // Menu items config
  const menuItems = [
    {
      title: t('common.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['student', 'parent', 'teacher', 'admin', 'super_admin'] as Role[]
    },
    {
      title: t('menu.attendance'),
      href: '/dashboard/attendance',
      icon: ClipboardCheck,
      roles: ['student', 'parent', 'teacher', 'director'] as Role[]
    },
    {
      title: t('menu.assignments'),
      href: '/dashboard/assignments',
      icon: BookOpen,
      roles: ['student', 'teacher', 'director'] as Role[]
    },
    {
      title: 'Grades & Results',
      href: '/grades',
      icon: Award,
      roles: ['student', 'parent'] as Role[]
    },
    {
      title: t('menu.timetable'),
      href: '/dashboard/timetable',
      icon: Clock,
      roles: ['student', 'teacher', 'director'] as Role[]
    },
    {
      title: 'Behavior Analytics',
      href: '/dashboard/behavior-analytics',
      icon: TrendingUp,
      roles: ['director'] as Role[]
    },
    {
      title: 'Exam Results',
      href: '/dashboard/results',
      icon: ClipboardList,
      roles: ['director'] as Role[]
    },
    {
      title: t('menu.messaging'),
      href: '/messaging',
      icon: MessageSquare,
      roles: ['student', 'parent', 'teacher', 'director'] as Role[]
    },
    {
      title: t('menu.resources'),
      href: '/dashboard/resources',
      icon: Library,
      roles: ['student', 'teacher', 'director'] as Role[]
    },
    {
      title: t('menu.appeals'),
      href: '/appeals',
      icon: AlertCircle,
      roles: ['student', 'parent', 'teacher', 'director'] as Role[]
    },
    {
      title: t('menu.calendar'),
      href: '/dashboard/calendar',
      icon: Calendar,
      roles: ['student', 'parent', 'teacher', 'director', 'admin'] as Role[]
    },
    {
      title: t('menu.behavior'),
      href: '/behavior',
      icon: ThumbsUp,
      roles: ['student', 'parent', 'teacher', 'director'] as Role[]
    },
    {
      title: t('menu.gradebook'),
      href: '/dashboard/gradebook',
      icon: FileEdit,
      roles: ['teacher'] as Role[]
    },
    {
      title: t('menu.schools'),
      href: '/schools',
      icon: School,
      roles: ['super_admin'] as Role[]
    },
    {
      title: t('menu.salary'),
      href: '/salary',
      icon: DollarSign,
      roles: ['teacher', 'director'] as Role[]
    },
    {
      title: t('menu.users'),
      href: '/dashboard/users',
      icon: Users,
      roles: ['admin', 'super_admin', 'director'] as Role[]
    },
    {
      title: 'Classes',
      href: '/classes',
      icon: UsersRound,
      roles: ['director'] as Role[]
    },
    {
      title: t('menu.reports'),
      href: '/reports',
      icon: FileBarChart,
      roles: ['director', 'admin', 'super_admin'] as Role[]
    },
    {
      title: 'Audit',
      href: '/audit',
      icon: Shield,
      roles: ['admin', 'super_admin'] as Role[]
    },
    {
      title: 'Backup',
      href: '/backup',
      icon: Database,
      roles: ['super_admin'] as Role[]
    },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  // Role badge colors
  const roleColors: Record<Role, string> = {
    student: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    parent: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    teacher: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    director: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    super_admin: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  const roleLabels: Record<Role, string> = {
    student: t('roles.student') || 'Student',
    parent: t('roles.parent') || 'Parent',
    teacher: t('roles.teacher') || 'Teacher',
    director: t('roles.director') || 'Director',
    admin: t('roles.admin') || 'Admin',
    super_admin: t('roles.super_admin') || 'Super Admin',
  };

  return (
    <motion.aside 
      animate={{ width: sidebarOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen border-r bg-card"
    >
      {/* Logo Section - 80px height */}
      <div className="flex h-20 items-center justify-between border-b px-4">
        <Logo collapsed={!sidebarOpen} />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="hidden md:flex"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
        </Button>
      </div>

      {/* Role Badge */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b p-4"
          >
            <div className="flex items-center justify-between">
              <Badge className={cn("text-xs px-3 py-1 rounded-full", roleColors[role])}>
                {roleLabels[role]}
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-12rem)] py-4">
        <nav className="grid gap-2 px-2">
          {filteredItems.map((item, index) => {
            const isActive = location === item.href;
            return (
              <Link key={index} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                    !sidebarOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile at Bottom */}
      <div className="absolute bottom-0 w-full border-t bg-card p-4 space-y-2">
        <AnimatePresence>
          {sidebarOpen && user && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive", !sidebarOpen && "justify-center px-2")}
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span>{t('common.logout')}</span>}
        </Button>
      </div>
    </motion.aside>
  );
});
