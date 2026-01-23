'use client';
import {
  MessageCircle,
  Settings,
  Shapes,
  Usb,
  ListMinus,
  Tags,
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
    icon: MessageCircle,
  },
  {
    title: '元数据管理',
    url: '/source-data',
    icon: Usb,
  },
  {
    title: '分类分级标签',
    url: '/tags',
    icon: Tags,
  },
  {
    title: '分类分级任务',
    url: '/schedule',
    icon: ListMinus,
  },
  {
    title: '分类分级统计',
    url: '/statistics',
    icon: Shapes,
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
    <Sidebar collapsible="icon" className="transition-all z-20000">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className=" flex size-10 items-center justify-center rounded-lg">
                  <img src={'logo.webp'} className="bg-white" />
                </div>
                <div className="flex-1 text-left text-md leading-tight flex items-center">
                  <span className="truncate font-medium">智数中心</span>
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
                          ? 'bg-blue-600! text-white! hover:text-white! hover:bg-blue-600! active:bg-blue-600!'
                          : 'hover:bg-blue-100 hover:text-blue-600',
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
