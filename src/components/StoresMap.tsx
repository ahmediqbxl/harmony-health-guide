import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Store {
  name: string;
  coordinates?: Coordinates;
  distanceKm?: number;
}

interface StoresMapProps {
  stores: Store[];
  userLocation?: Coordinates;
  mapboxToken: string;
}

export const StoresMap: React.FC<StoresMapProps> = ({ stores, userLocation, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Default center to first store or user location
    const defaultCenter: [number, number] = userLocation 
      ? [userLocation.lng, userLocation.lat]
      : stores[0]?.coordinates 
        ? [stores[0].coordinates.lng, stores[0].coordinates.lat]
        : [-114.0719, 51.0447]; // Calgary default

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    if (userLocation) {
      const userMarker = document.createElement('div');
      userMarker.className = 'w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg';
      
      new mapboxgl.Marker(userMarker)
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<div class="font-semibold">Your Location</div>'))
        .addTo(map.current);
    }

    // Add store markers
    stores.forEach((store) => {
      if (!store.coordinates || !map.current) return;

      const storeMarker = document.createElement('div');
      storeMarker.className = 'w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-lg';

      const distanceText = store.distanceKm 
        ? `<div class="text-sm text-muted-foreground">${store.distanceKm} km away</div>`
        : '';

      new mapboxgl.Marker(storeMarker)
        .setLngLat([store.coordinates.lng, store.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="font-semibold">${store.name}</div>${distanceText}`
          )
        )
        .addTo(map.current);
    });

    // Fit map to show all markers
    if (stores.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat]);
      }
      
      stores.forEach((store) => {
        if (store.coordinates) {
          bounds.extend([store.coordinates.lng, store.coordinates.lat]);
        }
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [stores, userLocation, mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        Please add your Mapbox public token to view the map
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};