import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="teacher" />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold">Main Content Area</h2>
          <p className="text-muted-foreground mt-2">
            The sidebar adapts based on user role (teacher shown here).
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
}
