export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 页面标题 */}
      <div className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">分类分级标签</h1>
        </div>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
}
