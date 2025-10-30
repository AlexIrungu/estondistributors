'use client'

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell, Package, MapPin } from 'lucide-react';
import { getLowStockAlerts, formatQuantity } from '@/lib/db/inventoryStorage';

export default function LowStockAlert({ 
  showDismiss = true,
  autoShow = true,
  variant = 'banner' // 'banner', 'widget', 'inline'
}) {
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    loadAlerts();
    
    // Check for dismissed state in localStorage
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('low_stock_dismissed');
      if (dismissed) {
        const dismissedTime = new Date(dismissed);
        const now = new Date();
        // Auto-show after 24 hours
        if (now - dismissedTime < 24 * 60 * 60 * 1000) {
          setIsDismissed(true);
          setIsVisible(false);
        }
      }
    }
  }, []);

  const loadAlerts = () => {
    const lowStockItems = getLowStockAlerts();
    setAlerts(lowStockItems);
    
    if (!autoShow || lowStockItems.length === 0) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('low_stock_dismissed', new Date().toISOString());
    }
  };

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  const fuelNames = {
    PMS: 'Super Petrol',
    AGO: 'Diesel',
    IK: 'Kerosene'
  };

  // Banner variant (top of page, full width)
  if (variant === 'banner') {
    const criticalCount = alerts.filter(a => a.status.level === 'critical').length;
    const lowCount = alerts.filter(a => a.status.level === 'low').length;

    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm md:text-base">
                  {criticalCount > 0 && `${criticalCount} Critical Stock Alert${criticalCount > 1 ? 's' : ''}`}
                  {criticalCount > 0 && lowCount > 0 && ' • '}
                  {lowCount > 0 && `${lowCount} Low Stock Item${lowCount > 1 ? 's' : ''}`}
                </p>
                <p className="text-xs md:text-sm text-white/90 mt-0.5">
                  Order now to avoid supply disruptions
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="/inventory"
                className="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                View Details
              </a>
              {showDismiss && (
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Widget variant (sidebar, dashboard)
  if (variant === 'widget') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-secondary-900">
              Stock Alerts
            </h3>
          </div>
          {alerts.length > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {alerts.length}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-2 ${alert.status.borderColor} ${alert.status.bgColor}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className={`w-4 h-4 ${alert.status.textColor}`} />
                    <span className={`text-sm font-bold ${alert.status.textColor}`}>
                      {fuelNames[alert.fuelType]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <MapPin className="w-3 h-3" />
                    <span>{alert.locationName}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${alert.status.bgColor} ${alert.status.textColor}`}>
                  {alert.status.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Available:</span>
                <span className={`font-bold ${alert.status.textColor}`}>
                  {formatQuantity(alert.available)}
                </span>
              </div>

              <div className="mt-2 w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    alert.status.level === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${alert.percentageFull}%` }}
                />
              </div>
            </div>
          ))}

          <a
            href="/contact"
            className="block w-full text-center py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Contact Sales Team
          </a>
        </div>
      </div>
    );
  }

  // Inline variant (within page content)
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-secondary-900 mb-2">
            Low Stock Alert
          </h3>
          <p className="text-neutral-700 mb-4">
            {alerts.length} fuel type{alerts.length > 1 ? 's' : ''} running low. 
            Order now to ensure continuous supply.
          </p>

          <div className="space-y-2 mb-4">
            {alerts.slice(0, 3).map((alert, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-semibold text-secondary-900 text-sm">
                      {fuelNames[alert.fuelType]} - {alert.locationName}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {formatQuantity(alert.available)} available
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.status.bgColor} ${alert.status.textColor}`}>
                  {alert.status.label}
                </span>
              </div>
            ))}
          </div>

          {alerts.length > 3 && (
            <p className="text-sm text-neutral-600 mb-4">
              +{alerts.length - 3} more alert{alerts.length - 3 > 1 ? 's' : ''}
            </p>
          )}

          <div className="flex gap-3">
            <a
              href="/inventory"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              View All Stock
            </a>
            <a
              href="/contact"
              className="px-6 py-2 bg-white border-2 border-neutral-300 text-neutral-700 rounded-lg text-sm font-semibold hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {showDismiss && (
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        )}
      </div>
    </div>
  );
}