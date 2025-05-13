import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChevronDownIcon, 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  TagIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  CreditCardIcon, 
  CogIcon, 
  ChatBubbleLeftIcon,
  DocumentChartBarIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Navigation items for the sidebar
const navigationItems = [
  { name: 'Dashboard', path: '/business/dashboard', icon: ChartBarIcon },
  { 
    name: 'Catalog', 
    icon: CubeIcon,
    submenu: [
      { name: 'Products', path: '/business/catalog/products', icon: CubeIcon },
      { name: 'Categories', path: '/business/catalog/categories', icon: ListBulletIcon },
      { name: 'Attributes', path: '/business/catalog/attributes', icon: AdjustmentsHorizontalIcon },
    ]
  },
  { name: 'Orders', path: '/business/orders', icon: ShoppingBagIcon },
  { name: 'Inventory', path: '/business/inventory', icon: TagIcon },
  { name: 'Customers', path: '/business/customers', icon: UserGroupIcon },
  { name: 'Payments', path: '/business/payments', icon: CreditCardIcon },
  { name: 'Promotions', path: '/business/promotions', icon: TagIcon },
  { name: 'Reviews', path: '/business/reviews', icon: StarIcon },
  { name: 'Reports', path: '/business/reports', icon: DocumentChartBarIcon },
  { name: 'Support', path: '/business/support', icon: ChatBubbleLeftIcon },
  { name: 'Settings', path: '/business/settings', icon: CogIcon },
];

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isMerchant, isMerchantVerified, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    Catalog: true // Start with Catalog expanded
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-expand submenu if current path matches a submenu item
  useEffect(() => {
    navigationItems.forEach(item => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(subItem => 
          location.pathname.startsWith(subItem.path)
        );
        if (isSubmenuActive) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [location.pathname]);

  // Handle unauthorized access
  if (!isAuthenticated || !isMerchant) {
    return <Navigate to="/business-login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/business-login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">Merchant Portal</span>
          </div>
          {isMobile && (
            <button 
              onClick={toggleSidebar}
              className="ml-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Sidebar Content - allows scrolling only within sidebar content */}
        <div className="py-4 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              // Determine if this item or any of its subitems is active
              const hasSubmenu = !!item.submenu;
              const isMenuActive = hasSubmenu 
                ? item.submenu.some(subItem => location.pathname.startsWith(subItem.path))
                : location.pathname === item.path;
              const isExpanded = expandedMenus[item.name] || false;

              return (
                <div key={item.name}>
                  {hasSubmenu ? (
                    // Menu item with submenu
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`${
                          isMenuActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md transition-colors`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`${
                              isMenuActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                            } mr-3 flex-shrink-0 h-6 w-6 transition-colors`}
                          />
                          {item.name}
                        </div>
                        <ChevronDownIcon
                          className={`${
                            isExpanded ? 'transform rotate-180' : ''
                          } h-4 w-4 text-gray-500 transition-transform`}
                        />
                      </button>
                      
                      {/* Submenu items */}
                      {isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map(subItem => {
                            const isSubItemActive = location.pathname.startsWith(subItem.path);
                            return (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className={`${
                                  isSubItemActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                              >
                                <subItem.icon
                                  className={`${
                                    isSubItemActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                                  } mr-3 flex-shrink-0 h-5 w-5 transition-colors`}
                                />
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular menu item without submenu
                    <Link
                      to={item.path}
                      className={`${
                        isMenuActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                    >
                      <item.icon
                        className={`${
                          isMenuActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-6 w-6 transition-colors`}
                      />
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Main Content - fixed height, no overflow */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - fixed height */}
        <header className="bg-white shadow z-10 h-16 flex-shrink-0">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Left: Hamburger Menu (mobile) */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            {/* Right: Notifications, Profile */}
            <div className="ml-auto flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  <BellIcon className="h-6 w-6" />
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm font-medium text-gray-900">New Order #{1000 + item}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              A new order has been placed by Customer {item}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Just now</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link to="/business/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'M'}
                  </div>
                  <span className="hidden md:block text-gray-700 font-medium">
                    {user?.name || user?.email?.split('@')[0] || 'Merchant'}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to="/business/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/business/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content - allows scrolling within content area */}
        <main className="flex-1 overflow-auto relative">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Dark Overlay for Mobile when Sidebar is Open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout; 