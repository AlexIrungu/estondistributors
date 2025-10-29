'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, X, Fuel, TruckIcon, Phone, TrendingUp, ChevronDown, 
  History, Calculator, Package, Bell, User, 
  BarChart, Truck, Settings, LogOut, ShoppingCart
} from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pricesDropdownOpen, setPricesDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pricesDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pricesDropdownRef.current && !pricesDropdownRef.current.contains(event.target)) {
        setPricesDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setPricesDropdownOpen(false);
    setToolsDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navigation = [
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
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg py-2' : 'shadow-md py-0'
        }`}
      >
        {/* Top bar with contact info - hidden on mobile, shown on desktop */}
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

        {/* Main navigation */}
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div 
                  key={item.name} 
                  className="relative" 
                  ref={item.hasDropdown ? (item.name === 'Prices' ? pricesDropdownRef : toolsDropdownRef) : null}
                >
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => {
                          if (item.name === 'Prices') {
                            setPricesDropdownOpen(!pricesDropdownOpen);
                            setToolsDropdownOpen(false);
                            setUserDropdownOpen(false);
                          } else {
                            setToolsDropdownOpen(!toolsDropdownOpen);
                            setPricesDropdownOpen(false);
                            setUserDropdownOpen(false);
                          }
                        }}
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
                          (item.name === 'Prices' && pricesDropdownOpen) || 
                          (item.name === 'Tools' && toolsDropdownOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Dropdown Menu */}
                      {(item.name === 'Prices' && pricesDropdownOpen) || (item.name === 'Tools' && toolsDropdownOpen) ? (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
                          {item.dropdownItems.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group"
                              onClick={() => {
                                setPricesDropdownOpen(false);
                                setToolsDropdownOpen(false);
                              }}
                            >
                              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                                {dropItem.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-secondary-900 text-sm">
                                    {dropItem.name}
                                  </span>
                                  {dropItem.badge && (
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
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
                      ) : null}
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

            {/* CTA Buttons - Desktop */}
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
                      onClick={() => {
                        setUserDropdownOpen(!userDropdownOpen);
                        setPricesDropdownOpen(false);
                        setToolsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
                    >
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="hidden xl:inline">{session.user.name || 'Account'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {userDropdownOpen && (
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
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <BarChart className="w-4 h-4 text-primary-600" />
                          <span className="text-sm font-medium text-secondary-900">Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard?tab=orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <ShoppingCart className="w-4 h-4 text-neutral-600" />
                          <span className="text-sm font-medium text-secondary-900">My Orders</span>
                        </Link>
                        <Link
                          href="/dashboard?tab=settings"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-neutral-600" />
                          <span className="text-sm font-medium text-secondary-900">Settings</span>
                        </Link>
                        <div className="border-t border-neutral-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Logout</span>
                        </button>
                      </div>
                    )}
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

            {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
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
              onClick={() => setIsMenuOpen(false)}
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
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
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
                        onClick={() => {
                          if (item.name === 'Prices') {
                            setPricesDropdownOpen(!pricesDropdownOpen);
                          } else {
                            setToolsDropdownOpen(!toolsDropdownOpen);
                          }
                        }}
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
                          (item.name === 'Prices' && pricesDropdownOpen) || 
                          (item.name === 'Tools' && toolsDropdownOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Mobile Dropdown Items */}
                      {(item.name === 'Prices' && pricesDropdownOpen) || (item.name === 'Tools' && toolsDropdownOpen) ? (
                        <div className="mt-1 ml-4 space-y-1">
                          {item.dropdownItems.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-start gap-3 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
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
                      ) : null}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell className="h-4 w-4" />
                  <span>Price Alerts</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/contact"
                  className="block text-center w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
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
}