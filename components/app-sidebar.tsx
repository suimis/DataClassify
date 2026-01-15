'use client';
import {
  DatabaseZap,
  Home,
  Layers2,
  Settings,
  Shapes,
  Usb,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  {
    title: '对话',
    url: '/chat',
    icon: Home,
  },

  {
    title: '数据分类分级',
    url: '/classify',
    icon: Shapes,
  },
  {
    title: '数据源接入',
    url: '/source-data',
    icon: Usb,
  },
  {
    title: '设置',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // 判断是否为当前页面
  const isActive = (url: string) => {
    // 首页特殊处理
    if (url === '/') {
      return pathname === url;
    }
    // 其他页面检查是否以该路径开头
    return pathname?.startsWith(url);
  };
  return (
    <Sidebar collapsible="icon" className="transition-all">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DatabaseZap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">数据治理ai平台</span>
                  <span className="truncate text-xs">v0.0.1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        'transition-all',
                        active
                          ? '!bg-blue-600 !text-white hover:!text-white hover:!bg-blue-600 active:!bg-blue-600'
                          : 'hover:bg-blue-100 hover:text-blue-600'
                      )}
                      isActive={active}
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon /> <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
