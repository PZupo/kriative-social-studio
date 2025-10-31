import { useState } from 'react';

const languages = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'PT-BR', flag: '🇧🇷' },
  { code: 'pt', label: 'PT', flag: '🇵🇹' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'ko', label: 'KO', flag: '🇰🇷' },
];

export default function KriativeHeader({ appName }: { appName: string }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[1]);

  return (
    <header id="kriative-header" className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-[#404040] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#008080] to-[#FF8C00] rounded-lg"></div>
            <span className="ml-3 text-xl font-bold text-[#333333] dark:text-white">
              {appName}
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="https://hub.kriative.app" className="text-[#333333] dark:text-white hover:text-[#008080] font-medium">
              Dashboard
            </a>
            <a href="/pricing" className="text-[#333333] dark:text-white hover:text-[#008080] font-medium">
              Planos
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#333333] text-sm font-medium"
              >
                <span>{currentLang.flag}</span>
                <span className="text-[#333333] dark:text-white">{currentLang.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#2A2A2A] rounded-lg shadow-xl border border-gray-200 dark:border-[#404040] z-[10000]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#333333] flex items-center space-x-2 text-sm"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A]">
              <svg className="w-5 h-5 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? (
              <svg className="w-6 h-6 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[#333333] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-[#1A1A1A] border-t dark:border-[#404040] pb-3">
          <div className="px-4 pt-2 space-y-1">
            <a href="https://hub.kriative.app" className="block px-3 py-2 text-[#333333] dark:text-white">Dashboard</a>
            <a href="/pricing" className="block px-3 py-2 text-[#333333] dark:text-white">Planos</a>
            <div className="pt-2 border-t dark:border-[#404040]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLang(lang)}
                  className="w-full text-left px-3 py-2 text-sm flex items-center space-x-2"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
