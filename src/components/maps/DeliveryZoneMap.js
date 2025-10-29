'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, TruckIcon, DollarSign, Info } from 'lucide-react';
import { DELIVERY_ZONES, calculateFullDeliveryCost } from '@/data/deliveryZones';

// Dynamic import for Leaflet (client-side only)
const DeliveryZoneMap = ({ selectedZone = null, onZoneSelect = null }) => {
  const [map, setMap] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [volume, setVolume] = useState(5000);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Load Leaflet dynamically
    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Fix Leaflet icon issue with Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Nairobi coordinates (your depot location)
      const nairobiBounds = [
        [-1.4436, 36.6516], // Southwest
        [-1.1634, 37.1031]  // Northeast
      ];

      const mapInstance = L.map('delivery-map', {
        center: [-1.2921, 36.8219], // Nairobi center
        zoom: 11,
        minZoom: 9,
        maxZoom: 15,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Define zone colors
      const zoneColors = {
        'nairobi-cbd': '#10b981',      // Green
        'nairobi-inner': '#3b82f6',    // Blue
        'nairobi-outer': '#f59e0b',    // Amber
        'kiambu-county': '#ef4444',    // Red
        'central-region': '#8b5cf6',   // Purple
        'eastern-region': '#ec4899',   // Pink
        'coast-region': '#06b6d4',     // Cyan
        'western-region': '#84cc16',   // Lime
        'rift-valley-region': '#f97316' // Orange
      };

      // Add depot marker
      const depotIcon = L.divIcon({
        html: `<div style="background: #dc2626; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>`,
        className: 'depot-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([-1.2921, 36.8219], { icon: depotIcon })
        .addTo(mapInstance)
        .bindPopup(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">Eston Distributors HQ</h3>
            <p style="font-size: 12px; color: #666;">Main Depot & Distribution Center</p>
          </div>
        `);

      // Add zone circles for Nairobi zones
      Object.entries(DELIVERY_ZONES.nairobi).forEach(([key, zone]) => {
        const radiusMap = {
          'nairobi-cbd': 5000,      // 5km
          'nairobi-inner': 10000,   // 10km
          'nairobi-outer': 20000,   // 20km
        };

        const circle = L.circle([-1.2921, 36.8219], {
          color: zoneColors[zone.id],
          fillColor: zoneColors[zone.id],
          fillOpacity: 0.15,
          weight: 2,
          radius: radiusMap[zone.id] || 5000,
        }).addTo(mapInstance);

        circle.bindPopup(`
          <div style="padding: 12px; min-width: 250px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: ${zoneColors[zone.id]};">${zone.name}</h3>
            <div style="font-size: 14px; color: #333;">
              <p style="margin: 4px 0;"><strong>Base Cost:</strong> ${zone.baseCost === 0 ? 'FREE' : `KES ${zone.baseCost.toLocaleString()}`}</p>
              <p style="margin: 4px 0;"><strong>Delivery Time:</strong> ${zone.estimatedTime}</p>
              ${zone.freeDeliveryThreshold ? `<p style="margin: 4px 0;"><strong>Free Delivery:</strong> Orders over ${zone.freeDeliveryThreshold.toLocaleString()}L</p>` : ''}
              <p style="margin: 8px 0 4px; font-weight: 600;">Areas:</p>
              <p style="font-size: 12px; color: #666; margin: 0;">${zone.areas.slice(0, 5).join(', ')}${zone.areas.length > 5 ? '...' : ''}</p>
            </div>
          </div>
        `);

        // Add zone label
        const labelIcon = L.divIcon({
          html: `<div style="background: white; padding: 4px 8px; border-radius: 12px; border: 2px solid ${zoneColors[zone.id]}; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${zone.name}</div>`,
          className: 'zone-label',
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });

        const labelPosition = {
          'nairobi-cbd': [-1.2821, 36.8219],
          'nairobi-inner': [-1.2621, 36.8519],
          'nairobi-outer': [-1.2321, 36.8919],
        };

        L.marker(labelPosition[zone.id] || [-1.2921, 36.8219], { icon: labelIcon })
          .addTo(mapInstance);
      });

      setMap(mapInstance);

      return () => {
        mapInstance.remove();
      };
    };

    loadMap();
  }, [isClient]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search for zone by area name
    const foundZone = findZoneByAreaName(searchQuery);
    
    if (foundZone) {
      setSearchResults({
        found: true,
        zone: foundZone,
        cost: calculateFullDeliveryCost(foundZone.id, volume, 'standard'),
      });
    } else {
      setSearchResults({
        found: false,
        query: searchQuery,
      });
    }
  };

  const findZoneByAreaName = (areaName) => {
    const searchTerm = areaName.toLowerCase().trim();
    
    // Search Nairobi zones
    for (const zone of Object.values(DELIVERY_ZONES.nairobi)) {
      if (zone.areas && zone.areas.some(area => 
        area.toLowerCase().includes(searchTerm) || searchTerm.includes(area.toLowerCase())
      )) {
        return zone;
      }
    }
    
    // Search Kiambu
    if (DELIVERY_ZONES.kiambu.areas && DELIVERY_ZONES.kiambu.areas.some(area =>
      area.toLowerCase().includes(searchTerm) || searchTerm.includes(area.toLowerCase())
    )) {
      return DELIVERY_ZONES.kiambu;
    }
    
    // Search regional zones
    for (const region of Object.values(DELIVERY_ZONES.regional)) {
      if (region.majorTowns && region.majorTowns.some(town =>
        town.toLowerCase().includes(searchTerm) || searchTerm.includes(town.toLowerCase())
      )) {
        return region;
      }
    }
    
    return null;
  };

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-neutral-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Search & Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-neutral-200">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-5 w-5 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-900">Find Your Delivery Zone</h3>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Your Location / Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Westlands, Karen, Thika"
                  className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Order Volume (Liters)
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                min="100"
                step="100"
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl"
          >
            Calculate Delivery Cost
          </button>
        </form>

        {/* Search Results */}
        {searchResults && (
          <div className={`mt-6 p-6 rounded-xl border-2 ${
            searchResults.found 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {searchResults.found ? (
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-green-900 mb-1">
                      We deliver to your area!
                    </h4>
                    <p className="text-green-700 text-sm">
                      {searchResults.zone.name} - {searchResults.zone.estimatedTime}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Delivery Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary-900">
                      {searchResults.cost.isFree ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `KES ${searchResults.cost.finalCost.toLocaleString()}`
                      )}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Delivery Time</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary-900">
                      {searchResults.zone.estimatedTime}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 text-neutral-600 text-sm mb-1">
                      <TruckIcon className="h-4 w-4" />
                      <span>Volume</span>
                    </div>
                    <p className="text-2xl font-bold text-secondary-900">
                      {volume.toLocaleString()}L
                    </p>
                  </div>
                </div>

                {!searchResults.cost.isFree && searchResults.cost.volumeDiscountPercent > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Volume Discount Applied:</strong> {searchResults.cost.volumeDiscountPercent}% off (KES {searchResults.cost.volumeDiscount.toLocaleString()} saved)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-1">
                    Area not found
                  </h4>
                  <p className="text-red-700 text-sm">
                    We couldn't find "{searchResults.query}" in our delivery zones. Please try another area name or contact us for custom delivery options.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-neutral-200">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Interactive Delivery Map</h3>
              <p className="text-sm text-primary-100">Click on zones to view details</p>
            </div>
            <MapPin className="h-8 w-8 opacity-80" />
          </div>
        </div>
        
        <div id="delivery-map" className="w-full h-[600px]"></div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-neutral-200">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Zone Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(DELIVERY_ZONES.nairobi).map(([key, zone]) => {
            const colors = {
              'nairobi-cbd': 'bg-green-500',
              'nairobi-inner': 'bg-blue-500',
              'nairobi-outer': 'bg-amber-500',
            };
            return (
              <div key={zone.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${colors[zone.id]}`}></div>
                <div>
                  <p className="text-sm font-semibold text-secondary-900">{zone.name}</p>
                  <p className="text-xs text-neutral-600">
                    {zone.baseCost === 0 ? 'Free' : `KES ${zone.baseCost.toLocaleString()}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryZoneMap;