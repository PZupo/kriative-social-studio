import { useEffect, useState } from 'react';
export function useTheme(){
  const [theme,setTheme] = useState<'light'|'dark'>((localStorage.getItem('kss_theme') as any) || 'light');
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('kss_theme', theme); },[theme]);
  return { theme, toggle:()=>setTheme(t=>t==='light'?'dark':'light') };
}