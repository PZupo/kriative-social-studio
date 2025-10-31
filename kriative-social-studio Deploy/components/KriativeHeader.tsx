export default function KriativeHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg"></div>
          <span className="text-xl font-bold">Social Studio</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="https://hub.kriative.app" className="font-medium hover:text-teal-600">Dashboard</a>
          <a href="/pricing" className="font-medium hover:text-teal-600">Planos</a>
        </nav>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-800">
            <option>PT-BR</option>
            <option>EN</option>
          </select>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
