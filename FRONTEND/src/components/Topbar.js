import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

export default function Topbar({ dark, setDark, setMobileOpen }){
  return (
    <header className="bg-white dark:bg-[#071029] border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded bg-gray-100 dark:bg-gray-900" onClick={()=>setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="text-lg font-semibold">Admin Panel</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>setDark(d=>!d)} className="p-2 rounded bg-gray-100 dark:bg-gray-900">
            {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          {/* <div className="hidden sm:block px-3 py-1 rounded bg-gray-100 dark:bg-gray-900">admin@example.com</div> */}
        </div>
      </div>
    </header>
  );
}
