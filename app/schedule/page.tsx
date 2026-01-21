import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <section className="px-6 py-2 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800/90">分类分级任务</h1>
        </div>
      </section>
      <section className="m-6">
        <div className="rounded-md bg-gray-100/80 py-2 px-4">
          <div className="flex flex-col gap-0.5 text-md">
            <span>数据分类分级</span>
            <span className="text-black/60">
              通过引入数据质控测试提升数据的可信任度, 构建稳健的衍生数据产品
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
