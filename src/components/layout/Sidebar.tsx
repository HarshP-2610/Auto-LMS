import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  User,
  Settings,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PlayCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  GraduationCap,
  ClipboardList,
  Heart
} from 'lucide-react';

interface SidebarProps {
  userRole: 'student' | 'instructor' | 'admin';
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar({ userRole, isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();

  const studentNavItems: NavItem[] = [
    { label: 'Overview', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Learning', href: '/student/courses', icon: BookOpen },
    { label: 'Wishlist', href: '/student/wishlist', icon: Heart },
    { label: 'Quizzes', href: '/student/quizzes', icon: FileText },
    { label: 'Certificates', href: '/student/certificates', icon: Award },
    { label: 'My Profile', href: '/student/profile', icon: User },
  ];

  const instructorNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
    { label: 'Curriculum', href: '/instructor/lessons', icon: PlayCircle },
    { label: 'Assessments', href: '/instructor/quizzes', icon: FileText },
    { label: 'Students', href: '/instructor/students', icon: GraduationCap },
    { label: 'Statistics', href: '/instructor/analytics', icon: TrendingUp },
    { label: 'Profile Settings', href: '/instructor/profile', icon: User },
  ];


  const adminNavItems: NavItem[] = [
    { label: 'Admin Panel', href: '/admin/dashboard', icon: ShieldCheck },
    { label: 'Students', href: '/admin/students', icon: GraduationCap },
    { label: 'Instructors', href: '/admin/instructors', icon: Users },
    { label: 'Requests', href: '/admin/requests', icon: ClipboardList },
    { label: 'System Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    { label: 'My Profile', href: '/admin/profile', icon: User },
  ];

  const navItems =
    userRole === 'student'
      ? studentNavItems
      : userRole === 'instructor'
        ? instructorNavItems
        : adminNavItems;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  return (
    <aside
      className={`fixed left-0 top-16 lg:top-20 bottom-0 bg-white dark:bg-gray-950 border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-500 z-40 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Role Branding */}
        {!isCollapsed && (
          <div className="px-6 py-6 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <Zap className="w-3 h-3 text-blue-500" />
            {userRole} Menu
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto no-scrollbar py-2">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                      ? 'bg-blue-600 shadow-xl shadow-blue-500/20 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 overflow-hidden'
                      }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                    {!isCollapsed && (
                      <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 space-y-2 border-t border-gray-200/50 dark:border-gray-800/50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 mx-auto transition-transform group-hover:translate-x-1" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-semibold">Collapse Sidebar</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group ${isCollapsed ? 'justify-center' : ''
              }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:rotate-12" />
            {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
