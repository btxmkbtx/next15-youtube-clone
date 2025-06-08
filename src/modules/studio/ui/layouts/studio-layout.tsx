import { SidebarProvider } from "@/components/ui/sidebar";

import { StudioSidebar } from "@/modules/studio/ui/components/studio-sidebar";
import { StudioNavbar } from "../components/studio-navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
