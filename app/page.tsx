'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="w-full h-full flex items-center justify-center">
        <LottieAnimation width={128} height={128} />
      </div>
    </div>
  );
}
