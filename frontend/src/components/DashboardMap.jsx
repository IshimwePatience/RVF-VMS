import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom red icon for cases
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map based on bounds
function MapBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.coords));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [markers, map]);
  return null;
}

export default function DashboardMap({ locations }) {
  const [markers, setMarkers] = useState([]);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (!locations || locations.length === 0) {
        setMarkers([]);
        return;
    }

    let isMounted = true;
    const processLocations = async () => {
      setGeocoding(true);
      const newMarkers = [];
      const cache = {};

      for (const loc of locations) {
        if (!isMounted) break;
        
        const { province, district, sector, cell, village } = loc;
        const qParts = [];
        if (village) qParts.push(village);
        if (cell) qParts.push(cell);
        if (sector) qParts.push(sector);
        if (district) qParts.push(district);
        if (province) qParts.push(province);
        qParts.push('Rwanda');
        
        const fullLocationQuery = qParts.join(', ');
        
        // Search queries from most specific fallback
        const searchQueries = [
            [sector, district, province, 'Rwanda'].filter(Boolean).join(', '),
            [district, province, 'Rwanda'].filter(Boolean).join(', '),
            [province, 'Rwanda'].filter(Boolean).join(', ')
        ];

        let coords = null;

        for (const sq of searchQueries) {
            if (!sq || sq === 'Rwanda') continue;
            
            const cacheKey = `geo_${sq}`;
            // check memory
            if (cache[cacheKey]) {
                coords = cache[cacheKey];
                break;
            }
            // check localstorage
            const lsCache = localStorage.getItem(cacheKey);
            if (lsCache) {
                coords = JSON.parse(lsCache);
                cache[cacheKey] = coords;
                break;
            }
            
            // fetch
            await new Promise(r => setTimeout(r, 1200)); 
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(sq)}&format=json&limit=1`);
              const data = await res.json();
              if (data && data.length > 0) {
                coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                localStorage.setItem(cacheKey, JSON.stringify(coords));
                cache[cacheKey] = coords;
                break; // found!
              }
            } catch (err) {
              console.error("Geocoding err:", err);
            }
        }

        if (coords) {
          // Jitter to spread overlapping markers slightly
          const jitterLat = coords[0] + (Math.random() - 0.5) * 0.005;
          const jitterLon = coords[1] + (Math.random() - 0.5) * 0.005;
          newMarkers.push({
            id: loc.id,
            coords: [jitterLat, jitterLon],
            popup: [sector, district, province].filter(Boolean).join(', ') || 'Unknown Area'
          });
        }
      }
      
      if (isMounted) {
        setMarkers(newMarkers);
        setGeocoding(false);
      }
    };

    processLocations();

    return () => { isMounted = false; };
  }, [locations]);

  return (
    <div className="w-full h-full relative bg-slate-100">
      {geocoding && (
        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-[11px] font-bold text-blue-600 flex items-center gap-2 border border-blue-100">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Mapping Report Origins...
        </div>
      )}
      <MapContainer 
        center={[-1.9403, 29.8739]} 
        zoom={8} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds markers={markers} />
        {markers.map(m => (
          <Marker key={m.id} position={m.coords} icon={redIcon}>
            <Popup>
              <div className="font-bold text-slate-900 text-xs mb-1">Disease Case Origin</div>
              <div className="text-[10px] text-slate-600 leading-tight">{m.popup}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
