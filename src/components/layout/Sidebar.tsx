import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Award,
  User,
  Settings,
  Users,
  BarChart3,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  userRole: 'student' | 'instructor' | 'admin';
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const studentNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/student/courses', icon: BookOpen },
    { label: 'Quizzes', href: '/student/quizzes', icon: FileQuestion },
    { label: 'Certificates', href: '/student/certificates', icon: Award },
    { label: 'Profile', href: '/student/profile', icon: User },
  ];

  const instructorNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
    { label: 'Lessons', href: '/instructor/lessons', icon: FileQuestion },
    { label: 'Quizzes', href: '/instructor/quizzes', icon: CheckSquare },
    { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
    { label: 'Profile', href: '/instructor/profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Courses', href: '/admin/courses', icon: BookOpen },
    { label: 'Pending Instructors', href: '/admin/pending-instructors', icon: User },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems =
    userRole === 'student'
      ? studentNavItems
      : userRole === 'instructor'
        ? instructorNavItems
        : adminNavItems;

  return (
    <aside
      className={`fixed left-0 top-16 lg:top-20 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
}
