'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Fuel, TruckIcon, Phone, TrendingUp, ChevronDown, History, BarChart3, Calculator, Package } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pricesDropdownOpen, setPricesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPricesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setPricesDropdownOpen(false);
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
          name: 'Calculator', 
          href: '/calculator', 
          icon: <Calculator className="w-4 h-4" />,
          description: 'Fuel savings calculator',
        }
      ]
    },
    { 
      name: 'Inventory', 
      href: '/inventory',
      badge: true,
      badgeText: 'Live',
      icon: <Package className="w-4 h-4" />
    },  // ← ADDED
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
              <div className="flex items-center gap-2">
                <span className="text-neutral-300">⏰</span>
                <span>Mon - Fri: 8AM - 6PM | Emergency: 24/7</span>
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
                <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setPricesDropdownOpen(!pricesDropdownOpen)}
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
                        <ChevronDown className={`w-4 h-4 transition-transform ${pricesDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {pricesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
                          {item.dropdownItems.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group"
                              onClick={() => setPricesDropdownOpen(false)}
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
                      )}
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
              <a
                href="tel:+254722943291"
                className="flex items-center gap-2 px-4 py-2 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>
              <Link
                href="/contact"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Quote
              </Link>
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

          {/* Mobile Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setPricesDropdownOpen(!pricesDropdownOpen)}
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
                        <ChevronDown className={`w-4 h-4 transition-transform ${pricesDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Mobile Dropdown Items */}
                      {pricesDropdownOpen && (
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
            <a
              href="tel:+254722943291"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-secondary-700 border-2 border-secondary-200 rounded-lg font-medium hover:border-secondary-300 hover:bg-secondary-50 transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>
            <Link
              href="/contact"
              className="block text-center w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}