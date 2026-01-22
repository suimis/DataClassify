import DotBackground from '@/components/dot-background';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <DotBackground />

      {children}
    </div>
  );
}
