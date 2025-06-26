import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

const LayoutContent: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main
          className={`
          flex-1 transition-all duration-300
          ${isExpanded ? 'lg:ml-72' : 'lg:ml-20'}
          ${isMobileOpen ? 'ml-0' : ''}`}
        >
          <div className="h-[calc(100vh-74px)] overflow-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);
