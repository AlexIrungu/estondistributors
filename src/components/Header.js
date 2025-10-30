'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, X, Fuel, TruckIcon, Phone, TrendingUp, ChevronDown, 
  History, Calculator, Package, Bell, User, 
  BarChart, Truck, Settings, LogOut, ShoppingCart
} from 'lucide-react';

// Extracted sub-components for better organization
const Logo = () => (
  <Link href="/" className="flex items-center gap-3 group">
    <div className="relative">
      <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative flex items-center gap-1 bg-primary-50 p-2 rounded-xl group-hover:bg-primary-100 transition-colors">
        <Fuel className="h-6 w-6 lg:h-7 lg:w-7 text-primary-500" />
        <TruckIcon className="h-5 w-5 lg:h-6 lg:w-6 text-accent-500" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-lg lg:text-xl font-bold text-secondary-700 leading-tight">
        Eston Distributors
      </span>
      <span className="text-xs text-neutral-500 hidden sm:block">
        Fuel & Transport Solutions
      </span>
    </div>
  </Link>
);

const TopBar = ({ session }) => (
  <div className="hidden lg:block bg-secondary-700 text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-10 text-sm">
        <div className="flex items-center gap-6">
          <a
            href="tel:+254722943291"
            className="flex items-center gap-2 hover:text-primary-300 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>+254 722 943 291</span>
          </a>
          <a
            href="mailto:estonkd@gmail.com"
            className="hover:text-primary-300 transition-colors"
          >
            estonkd@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-4">
          {session && (
            <span className="text-neutral-300">
              Welcome, <span className="text-white font-medium">{session.user.name}</span>
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-neutral-300">⏰</span>
            <span>Mon - Fri: 8AM - 6PM | Emergency: 24/7</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DropdownMenu = ({ items, isOpen, onClose, className = "" }) => {
  if (!isOpen) return null;
  
  return (
    <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-start gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group"
          onClick={onClose}
        >
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-secondary-900 text-sm">
                {item.name}
              </span>
              {item.badge && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const UserDropdown = ({ session, isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
      <div className="px-4 py-3 border-b border-neutral-200">
        <p className="text-sm font-semibold text-secondary-900">{session.user.name}</p>
        <p className="text-xs text-neutral-600">{session.user.email}</p>
        {session.user.role && (
          <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
            {session.user.role}
          </span>
        )}
      </div>
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
        onClick={onClose}
      >
        <BarChart className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-secondary-900">Dashboard</span>
      </Link>
      <Link
        href="/dashboard?tab=orders"
        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
        onClick={onClose}
      >
        <ShoppingCart className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-secondary-900">My Orders</span>
      </Link>
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
        onClick={onClose}
      >
        <Settings className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-secondary-900">Settings</span>
      </Link>
      <div className="border-t border-neutral-200 my-2"></div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
      >
        <LogOut className="w-4 h-4 text-red-600" />
        <span className="text-sm font-medium text-red-600">Logout</span>
      </button>
    </div>
  );
};

const DesktopNav = ({ 
  navigation, 
  isActive, 
  dropdownStates, 
  toggleDropdown, 
  closeAllDropdowns,
  dropdownRefs 
}) => (
  <div className="hidden lg:flex items-center gap-1">
    {navigation.map((item) => (
      <div 
        key={item.name} 
        className="relative" 
        ref={item.hasDropdown ? dropdownRefs[item.name] : null}
      >
        {item.hasDropdown ? (
          <>
            <button
              onClick={() => toggleDropdown(item.name)}
              className={`flex items-center gap-1 px-4 py-2 font-medium transition-colors rounded-lg ${
                isActive(item.href)
                  ? 'text-primary-600'
                  : 'text-neutral-700 hover:text-primary-500 hover:bg-primary-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.name}
                {item.badge && (
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    {item.badgeText}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${
                dropdownStates[item.name] ? 'rotate-180' : ''
              }`} />
            </button>
            <DropdownMenu 
              items={item.dropdownItems}
              isOpen={dropdownStates[item.name]}
              onClose={closeAllDropdowns}
            />
          </>
        ) : (
          <Link
            href={item.href}
            className={`relative flex items-center gap-2 px-4 py-2 font-medium transition-colors rounded-lg ${
              isActive(item.href)
                ? 'text-primary-600'
                : 'text-neutral-700 hover:text-primary-500 hover:bg-primary-50'
            }`}
          >
            {item.name}
            {item.badge && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                <Package className="h-3 w-3" />
                {item.badgeText}
              </span>
            )}
            {isActive(item.href) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-500 rounded-full"></span>
            )}
          </Link>
        )}
      </div>
    ))}
  </div>
);

const DesktopCTA = ({ session, status, userDropdownOpen, toggleUserDropdown, handleLogout, userDropdownRef }) => (
  <div className="hidden lg:flex items-center gap-3">
    {status === 'loading' ? (
      <div className="w-32 h-10 bg-neutral-100 animate-pulse rounded-lg"></div>
    ) : session ? (
      <>
        <Link
          href="/alerts"
          className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
        >
          <Bell className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
          <span className="hidden xl:inline">Alerts</span>
        </Link>
        <div className="relative" ref={userDropdownRef}>
          <button
  onClick={toggleUserDropdown}
  className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
>
  {session.user.image ? (
    <img 
      src={session.user.image} 
      alt={session.user.name}
      className="w-6 h-6 rounded-full object-cover"
    />
  ) : (
    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
      {session.user.name?.charAt(0).toUpperCase() || 'U'}
    </div>
  )}
  <span className="hidden xl:inline">{session.user.name || 'Account'}</span>
  <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
</button>
          <UserDropdown 
            session={session}
            isOpen={userDropdownOpen}
            onClose={() => toggleUserDropdown(false)}
            onLogout={handleLogout}
          />
        </div>
      </>
    ) : (
      <>
        <Link
          href="/alerts"
          className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
        >
          <Bell className="h-4 w-4 group-hover:text-amber-500 transition-colors" />
          <span className="hidden xl:inline">Price Alerts</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
        >
          <User className="h-4 w-4" />
          <span>Login</span>
        </Link>
        <Link
          href="/contact"
          className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Get Quote
        </Link>
      </>
    )}
  </div>
);

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  navigation, 
  session, 
  isActive, 
  dropdownStates, 
  toggleDropdown,
  handleLogout 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary-50 p-2 rounded-lg">
                <Fuel className="h-5 w-5 text-primary-500" />
                <TruckIcon className="h-4 w-4 text-accent-500" />
              </div>
              <span className="font-bold text-secondary-700">Eston</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info Section - Mobile */}
          {session && (
  <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
    <div className="flex items-center gap-3">
      {session.user.image ? (
        <img 
          src={session.user.image} 
          alt={session.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
        />
      ) : (
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-semibold text-secondary-900">{session.user.name}</p>
        <p className="text-xs text-neutral-600">{session.user.email}</p>
      </div>
    </div>
  </div>
)}

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              <TrendingUp className="h-3 w-3" />
                              {item.badgeText}
                            </span>
                          )}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          dropdownStates[item.name] ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {dropdownStates[item.name] && (
                        <div className="mt-1 ml-4 space-y-1">
                          {item.dropdownItems.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-start gap-3 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                              onClick={onClose}
                            >
                              <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                {dropItem.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-secondary-900 text-sm">
                                    {dropItem.name}
                                  </span>
                                  {dropItem.badge && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                                      {dropItem.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                  {dropItem.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                      onClick={onClose}
                    >
                      <span className="flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            <Package className="h-3 w-3" />
                            {item.badgeText}
                          </span>
                        )}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Contact Info */}
            <div className="mt-8 px-4 space-y-3">
              <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
                <h3 className="text-sm font-semibold text-secondary-700 mb-3">
                  Contact Us
                </h3>
                <a
                  href="tel:+254722943291"
                  className="flex items-center gap-3 text-sm text-neutral-700 hover:text-primary-600 transition-colors mb-2"
                >
                  <Phone className="h-4 w-4 text-primary-500" />
                  <span>+254 722 943 291</span>
                </a>
                <a
                  href="mailto:estonkd@gmail.com"
                  className="text-sm text-neutral-600 hover:text-primary-600 transition-colors block"
                >
                  estonkd@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-neutral-200 space-y-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
                  onClick={onClose}
                >
                  <BarChart className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-medium hover:bg-red-100 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/alerts"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
                  onClick={onClose}
                >
                  <Bell className="h-4 w-4" />
                  <span>Price Alerts</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
                  onClick={onClose}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/contact"
                  className="block text-center w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  onClick={onClose}
                >
                  Get a Quote
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    Prices: false,
    Tools: false,
    User: false
  });
  
  const pricesDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const pathname = usePathname();

  // Memoized navigation config
  const navigation = useMemo(() => [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { 
      name: 'Prices', 
      href: '/prices', 
      badge: true, 
      badgeText: 'Live',
      hasDropdown: true,
      dropdownItems: [
        { 
          name: 'Current Prices', 
          href: '/prices', 
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Live EPRA fuel prices'
        },
        { 
          name: 'Price History', 
          href: '/prices/history', 
          icon: <History className="w-4 h-4" />,
          description: 'Historical trends & predictions'
        },
        { 
          name: 'Price Alerts', 
          href: '/alerts', 
          icon: <Bell className="w-4 h-4" />,
          description: 'Get notified of price changes',
          badge: 'New'
        }
      ]
    },
    { 
      name: 'Tools', 
      href: '/calculator',
      hasDropdown: true,
      dropdownItems: [
        { 
          name: 'Savings Calculator', 
          href: '/calculator', 
          icon: <Calculator className="w-4 h-4" />,
          description: 'Calculate fuel savings'
        },
        { 
          name: 'Fleet Management', 
          href: '/fleet', 
          icon: <Truck className="w-4 h-4" />,
          description: 'Manage your vehicle fleet'
        },
        ...(session ? [{
          name: 'Dashboard', 
          href: '/dashboard', 
          icon: <BarChart className="w-4 h-4" />,
          description: 'Customer dashboard & analytics'
        }] : [])
      ]
    },
    { 
      name: 'Inventory', 
      href: '/inventory',
      badge: true,
      badgeText: 'Live',
      icon: <Package className="w-4 h-4" />
    },
    { name: 'Transport', href: '/transport' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ], [session]);

  const dropdownRefs = useMemo(() => ({
    Prices: pricesDropdownRef,
    Tools: toolsDropdownRef,
    User: userDropdownRef
  }), []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs).forEach(([name, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownStates(prev => ({ ...prev, [name]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRefs]);

  // Close all menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownStates({ Prices: false, Tools: false, User: false });
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleDropdown = useCallback((name) => {
    setDropdownStates(prev => {
      const newState = { Prices: false, Tools: false, User: false };
      newState[name] = !prev[name];
      return newState;
    });
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setDropdownStates({ Prices: false, Tools: false, User: false });
  }, []);

  const isActive = useCallback((href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
    closeAllDropdowns();
  }, [closeAllDropdowns]);

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg py-2' : 'shadow-md py-0'
        }`}
      >
        <TopBar session={session} />
        
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Logo />
            
            <DesktopNav
              navigation={navigation}
              isActive={isActive}
              dropdownStates={dropdownStates}
              toggleDropdown={toggleDropdown}
              closeAllDropdowns={closeAllDropdowns}
              dropdownRefs={dropdownRefs}
            />
            
            <DesktopCTA
              session={session}
              status={status}
              userDropdownOpen={dropdownStates.User}
              toggleUserDropdown={() => toggleDropdown('User')}
              handleLogout={handleLogout}
              userDropdownRef={userDropdownRef}
            />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={navigation}
        session={session}
        isActive={isActive}
        dropdownStates={dropdownStates}
        toggleDropdown={toggleDropdown}
        handleLogout={handleLogout}
      />
    </>
  );
}