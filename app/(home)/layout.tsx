'use client';

import { AppSidebar } from '@/components/app-sidebar';
import '../globals.css';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="h-dvh w-full flex">
        {/* 左侧菜单栏 */}
        <AppSidebar />
        {/* 主内容区域 */}
        <SidebarInset>
          <main className="h-dvh">
            <header>
              <div className="absolute top-4 left-4 z-50"></div>
            </header>

            {/* 路由内容 */}
            <div className="flex flex-1 h-full overflow-y-auto">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
