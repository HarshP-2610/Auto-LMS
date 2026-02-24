import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'instructor' | 'admin';
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar isDashboard userRole={userRole} />
      <Sidebar userRole={userRole} />
      <main className="pt-16 lg:pt-20 pl-16 lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
