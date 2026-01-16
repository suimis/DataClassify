'use client';

import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverPresetSheetsCoreZhCN from '@univerjs/preset-sheets-core/locales/zh-CN';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { useEffect, useRef } from 'react';

import '@univerjs/preset-sheets-core/lib/index.css';

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { univerAPI } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: mergeLocales(UniverPresetSheetsCoreZhCN),
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    });

    univerAPI.createWorkbook({});

    return () => {
      univerAPI.dispose();
    };
  }, []);

  return <div className="w-full" ref={containerRef} />;
}
