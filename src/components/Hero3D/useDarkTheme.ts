import { useEffect, useRef } from 'react';

/** Ref that always reflects whether <html> has the `dark` class (no re-renders). */
export function useDarkTheme() {
  const isDark = useRef(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      isDark.current = document.documentElement.classList.contains('dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}