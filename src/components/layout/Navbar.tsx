import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Sun, Moon, GraduationCap, User, Bell,
  LogOut, LayoutDashboard, Clock, Search
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  isDashboard?: boolean;
  userRole?: 'student' | 'instructor' | 'admin';
}

export function Navbar({ isDashboard = false, userRole = 'student' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; avatar?: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      if (stored) {
        setUserData(JSON.parse(stored));
      }

      const token = localStorage.getItem('userToken');
      if (token && isDashboard) {
        fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.name) {
              setUserData(prev => ({ ...prev, name: data.name, avatar: data.avatar }));
              const updatedData = { ...JSON.parse(stored || '{}'), ...data };
              localStorage.setItem('userData', JSON.stringify(updatedData));
            }
          })
          .catch(err => console.error(`Error fetching ${userRole} profile:`, err));
      }

      if (token && userRole === 'admin') {
        fetch('http://localhost:5000/api/admin/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setNotifications(data);
            }
          })
          .catch(err => console.error('Error fetching admin notifications:', err));
      }
    } catch (error) {
      console.error("Failed parsing user data", error);
    }
  }, [userRole, isDashboard]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  const navLinks = isDashboard
    ? []
    : [
      { label: 'Home', href: '/' },
      { label: 'Courses', href: '/courses' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isDashboard
        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 h-16 lg:h-20'
        : 'bg-transparent h-20 lg:h-24'
        }`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Search Area */}
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Auto<span className="text-blue-600">LMS</span>
              </span>
            </Link>

            {isDashboard && (
              <div className="hidden md:flex items-center max-w-md w-full ml-4">
                <div className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search courses, lessons, analytics..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation (Public) */}
          <div className="hidden lg:flex items-center gap-8">
            {!isDashboard &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-all relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full ${location.pathname === link.href
                    ? 'text-blue-600 dark:text-blue-400 after:w-full'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* User Actions */}
            {isDashboard ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 group">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform" />
                      {userRole === 'admin' && notifications.length > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 mt-2 p-0 rounded-2xl overflow-hidden border-gray-200 dark:border-gray-800 shadow-2xl">
                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 font-bold text-sm border-b border-gray-100 dark:border-gray-800">
                      Notifications
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {userRole === 'admin' ? (
                        notifications.length > 0 ? (
                          notifications.map((notif: any) => (
                            <DropdownMenuItem key={notif.id} asChild>
                              <Link to={notif.link} className="flex flex-col gap-1 px-5 py-4 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(notif.time).toLocaleString()}
                                </p>
                              </Link>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No new notifications</p>
                          </div>
                        )
                      ) : (
                        <div className="p-8 text-center text-sm text-gray-500">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-1 pr-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm">
                      <div className="relative">
                        <img
                          src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name}`}
                          alt={userData?.name || 'User'}
                          className="w-10 h-10 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                          {userData?.name || 'User'}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                          {userRole}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 mt-2 p-1.5 rounded-2xl shadow-2xl border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3 mb-1 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Logged in as</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.name}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to={`/${userRole}/profile`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/${userRole}/dashboard`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard Overview</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-bold">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button variant="ghost" asChild className="rounded-xl px-6">
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 rounded-xl px-6 font-semibold"
                  asChild
                >
                  <Link to="/auth/register">Join for Free</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              {!isDashboard &&
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center transition-all ${location.pathname === link.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              {!isDashboard && (
                <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="outline" asChild className="rounded-xl w-full">
                    <Link to="/auth/login">Login</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl w-full font-semibold"
                    asChild
                  >
                    <Link to="/auth/register">Join for Free</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
