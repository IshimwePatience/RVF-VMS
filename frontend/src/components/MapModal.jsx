import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to dynamically change map view when coordinates change
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapModal({ isOpen, onClose, locationData, title }) {
  const [coordinates, setCoordinates] = useState([-1.9403, 29.8739]); // Default to Rwanda center
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [locationName, setLocationName] = useState('Rwanda');

  useEffect(() => {
    if (!isOpen || !locationData) return;

    const fetchCoordinates = async () => {
      setLoading(true);
      try {
        // Build search queries from most specific to least specific
        const queries = [];
        const { province, district, sector, cell, village } = locationData;
        const parts = [village, cell, sector, district, province].filter(Boolean);
        if (parts.length > 0) {
          queries.push([...parts, 'Rwanda'].join(', '));
        }

        if (sector && district && province) {
          queries.push(`${sector}, ${district}, ${province}, Rwanda`);
        }
        if (district && province) {
          queries.push(`${district}, ${province}, Rwanda`);
        }
        if (province) {
          queries.push(`${province}, Rwanda`);
        }
        queries.push(`Rwanda`);

        let found = false;
        
        for (const query of queries) {
          // Nominatim rate limiting rule: 1 request per second
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
          const data = await response.json();
          
          if (data && data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            setLocationName(query);
            
            // Set zoom based on specificity
            if (query.includes(sector)) setZoomLevel(13);
            else if (query.includes(district)) setZoomLevel(11);
            else if (query.includes(province)) setZoomLevel(9);
            else setZoomLevel(8);
            
            found = true;
            break;
          }
          // small delay to respect Nominatim usage policy if we retry
          await new Promise(r => setTimeout(r, 1000));
        }

        if (!found) {
          setCoordinates([-1.9403, 29.8739]); // Rwanda center fallback
          setZoomLevel(8);
          setLocationName('Rwanda (Location not precisely found)');
        }

      } catch (err) {
        console.error("Geocoding failed:", err);
        setCoordinates([-1.9403, 29.8739]);
        setZoomLevel(8);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [isOpen, locationData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{title || 'Location Map'}</h2>
            <p className="text-xs text-slate-500">
              {loading ? 'Locating...' : locationName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map Container */}
        <div className="w-full h-[500px] relative bg-slate-50">
          {loading && (
            <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="mt-2 text-sm font-medium text-slate-600">Geocoding Location...</span>
              </div>
            </div>
          )}
          
          <MapContainer 
            center={coordinates} 
            zoom={zoomLevel} 
            style={{ height: '100%', width: '100%', zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={coordinates} zoom={zoomLevel} />
            <Marker position={coordinates}>
              <Popup>
                <div className="font-bold text-slate-900">{title || 'Reported Issue'}</div>
                <div className="text-sm text-slate-600">{locationName}</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
