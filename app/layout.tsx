'use client';

import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
import { Plus, DatabaseIcon, SettingsIcon, Shredder } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 根据当前路径确定活动菜单项
  const getActiveMenuItem = () => {
    if (pathname?.startsWith('/chat')) return '新对话';
    if (pathname?.startsWith('/classify')) return '数据分类';
    if (pathname?.startsWith('/source-data')) return '源数据';
    if (pathname?.startsWith('/settings')) return '配置';
    return '新对话';
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());

  const menuItems = [
    {
      title: '新对话',
      url: '/chat',
      icon: Plus,
    },
    {
      title: '数据分类',
      url: '/classify',
      icon: Shredder,
    },
    {
      title: '源数据',
      url: '/source-data',
      icon: DatabaseIcon,
    },
    {
      title: '配置',
      url: '/settings',
      icon: SettingsIcon,
    },
  ];

  const handleMenuClick = (item: { title: string }) => {
    setActiveMenuItem(item.title);
  };

  return (
    <html lang="zh-CN">
      <body>
        <SidebarProvider>
          <div className="h-dvh w-full flex">
            {/* 左侧菜单栏 */}
            <Sidebar collapsible="icon" className="">
              <SidebarHeader className="">
                <div className="flex h-12 items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden text-ellipsis">
                    UPA智能数据治理系统
                  </h1>
                </div>
              </SidebarHeader>

              <SidebarContent className="">
                <SidebarGroup className="">
                  <SidebarGroupContent className="">
                    <SidebarMenu className="">
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.title} className="">
                          <Link href={item.url} passHref>
                            <SidebarMenuButton
                              className="cursor-pointer h-9"
                              isActive={activeMenuItem === item.title}
                              onClick={() => handleMenuClick(item)}
                              tooltip={item.title}
                            >
                              <item.icon />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarRail className="" />
            </Sidebar>

            {/* 主内容区域 */}
            <SidebarInset className="flex flex-col">
              {/* 折叠按钮 */}
              <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger className="" onClick={() => {}} />
              </div>

              {/* 路由内容 */}
              <div className="flex flex-1 pt-16 items-center overflow-hidden">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
