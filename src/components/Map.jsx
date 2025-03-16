// src/components/Map.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ZoomIn, ZoomOut, Layers, Navigation } from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icherisheher specific geocache locations
// These coordinates are specifically within the Icherisheher (Old City) of Baku
const sampleCaches = [
  { id: 1, name: 'Maiden Tower Secret', distance: 120, difficulty: 3, position: [40.3667, 49.8371] }, // Near Maiden Tower
  { id: 2, name: 'Palace Hidden Path', distance: 280, difficulty: 2, position: [40.3655, 49.8339] },  // Near Shirvanshahs' Palace
  { id: 3, name: 'Caravanserai Mystery', distance: 350, difficulty: 1, position: [40.3672, 49.8347] }, // Near Bukhara Caravanserai
  { id: 4, name: 'City Gate Riddle', distance: 500, difficulty: 3, position: [40.3645, 49.8368] }     // Near one of the old gates
];

// Custom marker icon for geocaches with improved styling
const createCacheIcon = (difficulty) => {
  // Different colors for different difficulty levels
  const colors = {
    1: '#4ade80', // Green for easy
    2: '#facc15', // Yellow for medium
    3: '#f87171'  // Red for hard
  };
  
  return L.divIcon({
    className: 'custom-cache-icon',
    html: `<div class="flex items-center justify-center" style="width: 32px; height: 32px;">
            <div style="width: 28px; height: 28px; background-color: ${colors[difficulty]}; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${difficulty}
            </div>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Custom user location marker
const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `<div class="flex items-center justify-center" style="width: 40px; height: 40px;">
          <div style="width: 16px; height: 16px; background-color: #3b82f6; border: 4px solid white; border-radius: 50%; box-shadow: 0 0 0 2px #3b82f6, 0 0 8px rgba(0,0,0,0.5);"></div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to update map center and zoom programmatically
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

// Component to handle location tracking
function LocationTracker({ setUserLocation, centerOnUser, setCenterOnUser }) {
  const map = useMap();
  const locationWatchId = useRef(null);
  
  useMapEvents({
    dragstart: () => {
      if (centerOnUser) setCenterOnUser(false);
    }
  });

  useEffect(() => {
    // Function to handle successful location retrieval
    const handleLocationFound = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const userLocation = [latitude, longitude];
      setUserLocation({
        position: userLocation,
        accuracy: accuracy
      });
        console.log(`User's GPS Location: Latitude ${latitude}, Longitude ${longitude}, Accuracy: ${accuracy} meters`);

      if (centerOnUser) {
        map.setView(userLocation);
      }
    };

    // Function to handle location errors
    const handleLocationError = (error) => {
      console.error('Error getting location:', error.message);
      // You might want to show an error message to the user here
    };

    // Start watching position
    if (navigator.geolocation) {
      locationWatchId.current = navigator.geolocation.watchPosition(
        handleLocationFound,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    // Clean up on unmount
    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, [map, setUserLocation, centerOnUser, setCenterOnUser]);

  return null;
}

const Map = ({ activeTab, setSelectedCache, openImageValidation }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [coordinates, setCoordinates] = useState({ lat: 40.3661, lng: 49.8372 });
  const [mapZoom, setMapZoom] = useState(16);
  const [userLocation, setUserLocation] = useState(null);
  const [centerOnUser, setCenterOnUser] = useState(true);
  
  // Precise center of Icherisheher, Baku
  const icherisheherCenter = [40.3657, 49.8352]; // More precise center of the old city
  
  // Approximate bounds of Icherisheher (Old City) for map framing
  const icherisheherBounds = [
    [40.3632, 49.8323], // Southwest corner
    [40.3685, 49.8381]  // Northeast corner
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update time every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Update coordinates when map moves
  const onMapMove = (e) => {
    const center = e.target.getCenter();
    setCoordinates({ lat: center.lat.toFixed(4), lng: center.lng.toFixed(4) });
  };
  
  const formatTimeDifference = (date) => {
    const diff = Math.floor((new Date() - date) / 60000); // difference in minutes
    return `${diff} mins ago`;
  };
  
  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };
  
  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 13));
  };
  
  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenterOnUser(true);
    } else {
      // You might want to show a message to the user that their location isn't available yet
      console.log('User location not available yet');
    }
  };

  // Add key points of interest in Icherisheher for better navigation context
  const keyLandmarks = [
    { 
      name: "Maiden Tower", 
      position: [40.3667, 49.8371], 
      description: "UNESCO World Heritage Site and iconic symbol of Baku, dating back to the 12th century."
    },
    { 
      name: "Palace of the Shirvanshahs", 
      position: [40.3655, 49.8339], 
      description: "15th-century royal palace complex, one of Azerbaijan's most valued architectural treasures."
    },
    { 
      name: "Juma Mosque", 
      position: [40.3656, 49.8354], 
      description: "Historic mosque in the heart of Icherisheher, built in the 12th century."
    },
    { 
      name: "Double Gates", 
      position: [40.3639, 49.8367], 
      description: "Main entrance to the old city, featuring restored medieval fortifications."
    }
  ];
  
  return (
    <div className="h-screen w-[calc(165vh-50px)]">
      {/* OpenStreetMap implementation with React Leaflet focused on Icherisheher */}
      <MapContainer 
        center={icherisheherCenter} 
        zoom={17} // Higher zoom level to focus on Icherisheher
        maxZoom={19}
        minZoom={15} // Limit how far users can zoom out to keep focus on Icherisheher
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        maxBounds={[
          [40.3600, 49.8290], // Extended southwest to ensure the area stays in view
          [40.3710, 49.8410]  // Extended northeast to ensure the area stays in view
        ]}
        whenReady={(e) => {
          e.target.on('moveend', onMapMove);
          setCoordinates({ 
            lat: e.target.getCenter().lat.toFixed(4), 
            lng: e.target.getCenter().lng.toFixed(4) 
          });
        }}
      >
        {/* Higher quality OpenStreetMap layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Optional: Add a subtle border around Icherisheher for better orientation */}
        <Rectangle 
          bounds={icherisheherBounds}
          pathOptions={{ color: '#3388ff', weight: 2, opacity: 0.5, fill: false }}
        />
        
        <MapController center={icherisheherCenter} zoom={mapZoom} />
        
        {/* User location tracking component */}
        <LocationTracker 
          setUserLocation={setUserLocation} 
          centerOnUser={centerOnUser}
          setCenterOnUser={setCenterOnUser}
        />
        
        {/* Display user's current location */}
        {userLocation && (
          <>
            <Marker 
              position={userLocation.position}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-gray-800">Your Location</h3>
                  <p className="text-sm text-gray-600">
                    {userLocation.position[0].toFixed(5)}° N, {userLocation.position[1].toFixed(5)}° E
                  </p>
                </div>
              </Popup>
            </Marker>
            {/* Accuracy circle around user's location */}
            <Circle 
              center={userLocation.position}
              radius={userLocation.accuracy}
              pathOptions={{ color: '#3b82f6', weight: 1, opacity: 0.5, fillOpacity: 0.1 }}
            />
          </>
        )}
        
        {/* Display key landmarks on the map regardless of active tab */}
        {keyLandmarks.map((landmark, index) => (
          <Marker 
            key={`landmark-${index}`}
            position={landmark.position}
            icon={L.divIcon({
              className: 'landmark-icon',
              html: `<div class="flex items-center justify-center" style="width: 32px; height: 32px;">
                      <div style="width: 28px; height: 28px; background-color: #3b82f6; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                    </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          >
            <Popup>
              <div className="p-1 max-w-xs">
                <h3 className="font-bold text-gray-800">{landmark.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{landmark.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Only show geocache markers when geocaching tab is active */}
        {activeTab === 'geocaching' && sampleCaches.map(cache => (
          <Marker 
            key={`cache-${cache.id}`}
            position={cache.position}
            icon={createCacheIcon(cache.difficulty)}
            eventHandlers={{
              click: () => setSelectedCache(cache.name)
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-800">{cache.name}</h3>
                <p className="text-sm text-gray-600">Difficulty: {cache.difficulty}</p>
                <div className="flex mb-2">
                  {Array.from({ length: cache.difficulty }).map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <button
                  className="bg-blue-500 text-white text-sm px-2 py-1 rounded mt-1 w-full"
                  onClick={() => openImageValidation(cache.id)}
                >
                  Validate Find
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map UI Controls */}
      <div className="absolute top-2 right-2 flex flex-col space-y-2 z-[1000]">
        <button 
          className="bg-gray-800 p-2 rounded-full shadow text-white"
          onClick={handleZoomIn}
        >
          <ZoomIn size={20} />
        </button>
        <button 
          className="bg-gray-800 p-2 rounded-full shadow text-white"
          onClick={handleZoomOut}
        >
          <ZoomOut size={20} />
        </button>
        <button 
          className="bg-gray-800 p-2 rounded-full shadow text-white"
        >
          <Layers size={20} />
        </button>
        <button 
          className={`p-2 rounded-full shadow text-white ${userLocation && centerOnUser ? 'bg-blue-600' : 'bg-gray-800'}`}
          onClick={handleCenterOnUser}
          title="Center on your location"
        >
          <Navigation size={20} />
        </button>
      </div>
      
      {/* Coordinates display */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded z-[1000] text-white">
        Coordinates: {coordinates.lat}° N {coordinates.lng}° E
      </div>
      
      {/* Last updated */}
      <div className="absolute bottom-2 right-2 flex items-center text-xs bg-black/70 px-2 py-1 rounded z-[1000] text-white">
        Last updated: {formatTimeDifference(lastUpdated)}
      </div>
    </div>
  );
};

Map.propTypes = {
  activeTab: PropTypes.string.isRequired,
  selectedCache: PropTypes.string,
  setSelectedCache: PropTypes.func.isRequired,
  openImageValidation: PropTypes.func.isRequired
};

MapController.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired
};

LocationTracker.propTypes = {
  setUserLocation: PropTypes.func.isRequired,
  centerOnUser: PropTypes.bool.isRequired,
  setCenterOnUser: PropTypes.func.isRequired
};

export default Map;