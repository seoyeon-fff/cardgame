'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-white/10" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow transition-all duration-300 cursor-pointer active:scale-95"
      aria-label="테마 전환"
      title={isDark ? '라이트 모드로 변경' : '다크 모드로 변경'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-in -spin-in-90 duration-300" />
      )}
    </button>
  );
}
