import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Users,
  ClipboardList,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UserRole =
  | "super-admin"
  | "director"
  | "administrator"
  | "teacher"
  | "student"
  | "parent";

interface AppSidebarProps {
  role?: UserRole;
}

const roleMenuItems: Record<UserRole, any[]> = {
  "super-admin": [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Schools", url: "/schools", icon: GraduationCap },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Users", url: "/users", icon: Users },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
  director: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Teachers", url: "/teachers", icon: Users },
    { title: "Attendance", url: "/attendance", icon: ClipboardList },
    { title: "Grades", url: "/grades", icon: FileText },
    { title: "Appeals", url: "/appeals", icon: AlertCircle },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Calendar", url: "/calendar", icon: Calendar },
  ],
  administrator: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Users", url: "/users", icon: Users },
    { title: "Classes", url: "/classes", icon: GraduationCap },
    { title: "Timetable", url: "/timetable", icon: Calendar },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
  teacher: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Attendance", url: "/attendance", icon: ClipboardList },
    { title: "Assignments", url: "/assignments", icon: FileText },
    { title: "Grades", url: "/grades", icon: BarChart3 },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Resources", url: "/resources", icon: FolderOpen },
    { title: "Calendar", url: "/calendar", icon: Calendar },
  ],
  student: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Assignments", url: "/assignments", icon: FileText },
    { title: "Grades", url: "/grades", icon: BarChart3 },
    { title: "Resources", url: "/resources", icon: BookOpen },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Messages", url: "/messages", icon: MessageSquare },
  ],
  parent: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Attendance", url: "/attendance", icon: ClipboardList },
    { title: "Grades", url: "/grades", icon: BarChart3 },
    { title: "Behavior", url: "/behavior", icon: Shield },
    { title: "Messages", url: "/messages", icon: MessageSquare },
    { title: "Appeals", url: "/appeals", icon: AlertCircle },
  ],
};

const roleLabels: Record<UserRole, string> = {
  "super-admin": "Super Admin",
  director: "Director",
  administrator: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export function AppSidebar({ role = "teacher" }: AppSidebarProps) {
  const items = roleMenuItems[role];

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold">ደብተርLink</h2>
            <p className="text-xs text-muted-foreground">Education Hub</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Badge variant="secondary" className="text-xs">
              {roleLabels[role]}
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover-elevate active-elevate-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              AB
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Abebe Kebede</p>
            <p className="text-xs text-muted-foreground truncate">
              {roleLabels[role]}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
