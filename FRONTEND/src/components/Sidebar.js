import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Tag, Box, ShoppingBag, Menu } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/products', label: 'Products', icon: Box },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
];

export default function Sidebar({ mobileOpen, setMobileOpen }){
  return (
    <>
      {/* Desktop */}
      <aside className="w-64 bg-white dark:bg-[#071029] border-r hidden md:flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">Food Delivery</div>
        </div>
        <nav className="px-2 py-4 flex-1">
          {links.map(l=>{
            const Icon = l.icon;
            return (
              <NavLink key={l.to} to={l.to} className={({isActive})=> 'flex items-center gap-3 p-3 rounded mb-1 ' + (isActive ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900')}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{l.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Mobile */}
      <div className={`fixed inset-0 z-40 ${mobileOpen ? '' : 'pointer-events-none' } md:hidden`} aria-hidden>
        <div className={`fixed inset-0 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={()=>setMobileOpen(false)}></div>
        <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#071029] transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between">
            <div className="text-xl font-bold">Food Admin</div>
            <button onClick={()=>setMobileOpen(false)} className="px-2">✕</button>
          </div>
          <nav className="px-2 py-4">
            {links.map(l=>{
              const Icon = l.icon;
              return (
                <NavLink key={l.to} to={l.to} onClick={()=>setMobileOpen(false)} className={({isActive})=> 'flex items-center gap-3 p-3 rounded mb-1 ' + (isActive ? 'bg-brand-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900')}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{l.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
