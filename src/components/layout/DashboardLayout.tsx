import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'instructor' | 'admin';
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar isDashboard userRole={userRole} />
      <Sidebar userRole={userRole} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`pt-16 lg:pt-20 transition-all duration-500 ease-in-out ${isCollapsed ? 'pl-20' : 'pl-20 lg:pl-[288px]'
          }`}
      >
        <div className="p-4 lg:p-10 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
