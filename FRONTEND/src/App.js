import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

export default function App(){
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(()=>{ document.documentElement.classList.toggle('dark', dark); },[dark]);

  return (
    <div className="min-h-screen flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col">
        <Topbar dark={dark} setDark={setDark} setMobileOpen={setMobileOpen} />
        <main className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
