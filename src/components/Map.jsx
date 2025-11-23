// src/components/Map.jsx
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { ZoomIn, ZoomOut, Layers, Navigation, Camera } from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle, Circle, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jsonData from './GeocachingData.json';

// Fix for the default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Icherisheher specific geocache locations
const sampleCaches = jsonData.geocaches;
// Map of coordinates to known locations in Icherisheher
const knownLocations = [
  { name: "Maiden Tower", position: [40.3667, 49.8371], radius: 50 },
  { name: "Palace of the Shirvanshahs", position: [40.3655, 49.8339], radius: 60 },
  { name: "Juma Mosque", position: [40.3656, 49.8354], radius: 40 },
  { name: "Double Gates", position: [40.3639, 49.8367], radius: 50 },
  { name: "Bukhara Caravanserai", position: [40.3672, 49.8347], radius: 45 },
  { name: "Muhammad Mosque", position: [40.3660, 49.8343], radius: 35 },
  { name: "Baku Museum of Miniature Books", position: [40.3651, 49.8361], radius: 30 },
  { name: "Multani Caravanserai", position: [40.3648, 49.8350], radius: 45 },
  { name: "Hamam Meydani", position: [40.3662, 49.8361], radius: 40 }
];

// Custom marker icon for geocaches with improved styling
const createCacheIcon = (difficulty, isSelected) => {
  // Different colors for different difficulty levels
  const colors = {
    1: '#4ade80', // Green for easy
    2: '#facc15', // Yellow for medium
    3: '#f87171'  // Red for hard
  };
  
  // If the cache is selected, create a more prominent icon
  if (isSelected) {
    return L.divIcon({
      className: 'custom-cache-icon-selected',
      html: `<div class="flex items-center justify-center" style="width: 42px; height: 42px;">
              <div style="width: 38px; height: 38px; background-color: ${colors[difficulty]}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 0 0 2px #3b82f6, 0 2px 6px rgba(0,0,0,0.5); animation: pulse 1.5s infinite;">
                ${difficulty}
              </div>
            </div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
              }
            </style>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });
  }
  
  // Regular icon for non-selected caches
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

// Custom icons for start and destination points
const startPointIcon = L.divIcon({
  className: 'start-point-icon',
  html: `<div class="flex items-center justify-center" style="width: 40px; height: 40px;">
          <div style="width: 28px; height: 28px; background-color: #22c55e; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const endPointIcon = L.divIcon({
  className: 'start-point-icon',
  html: `<div class="flex items-center justify-center" style="width: 40px; height: 40px;">
          <div style="width: 28px; height: 28px; background-color: #ef4444; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Component to set initial map view only - no automatic recentering
function InitialMapView({ center, zoom }) {
  const map = useMap();
  
  // This useEffect will only run once on component mount to set initial view
  useEffect(() => {
    map.setView(center, zoom);
  }, []); // Empty dependency array means this runs once on mount
  
  return null;
}

// NEW COMPONENT: Route Display
function RouteDisplay({ routeCoordinates, routeType }) {
  const map = useMap();
  
  // Get the style for the route based on route type
  const getRouteStyle = (type) => {
    switch (type) {
      case 'quickest':
        return { color: '#3b82f6', weight: 4, opacity: 0.8, dashArray: null }; // Blue
      case 'historical':
        return { color: '#7c3aed', weight: 4, opacity: 0.8, dashArray: '10, 5' }; // Purple with dash
      case 'geocaching':
        return { color: '#10b981', weight: 4, opacity: 0.8, dashArray: '5, 10' }; // Green with different dash
      default:
        return { color: '#3b82f6', weight: 4, opacity: 0.8, dashArray: null };
    }
  };
  
  // Fit map to route bounds when route changes
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      // Create bounds object for the route
      const bounds = routeCoordinates.reduce((bounds, coord) => {
        return bounds.extend([coord[0], coord[1]]);
      }, L.latLngBounds(routeCoordinates[0], routeCoordinates[0]));
      
      // Add padding to bounds
      map.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 1
      });
    }
  }, [routeCoordinates, map]);
  
  if (!routeCoordinates || routeCoordinates.length < 2) {
    return null;
  }
  
  return (
    <Polyline
      positions={routeCoordinates}
      pathOptions={getRouteStyle(routeType)}
    />
  );
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

// NEW COMPONENT: Add this component to focus on the selected cache
function FocusSelectedCache({ selectedCache }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedCache) {
      // Find the cache object that matches the selected name
      const selectedCacheObject = sampleCaches.find(cache => 
        cache.name === selectedCache ||
        (cache.name.includes('–') && cache.name.split('–')[1].trim() === selectedCache)
      );
      
      // If we found the cache, pan the map to its position
      if (selectedCacheObject) {
        // Pan to the selected cache position with animation
        map.flyTo(selectedCacheObject.position, 18, {
          animate: true,
          duration: 1.5,
          paddingTopLeft: [50, 50], // Add some padding
          paddingBottomRight: [50, 50]
        });
      }
    }
  }, [selectedCache, map]);
  
  return null;
}

// Function to get nearest known location based on coordinates
function getLocationName(coordinates) {
  // Calculate distance between two points in meters
  const calculateDistance = (point1, point2) => {
    // Earth's radius in meters
    const R = 6371e3;
    const φ1 = point1[0] * Math.PI / 180;
    const φ2 = point2[0] * Math.PI / 180;
    const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
    const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Find nearest known location
  let nearestLocation = null;
  let minDistance = Infinity;

  for (const location of knownLocations) {
    const distance = calculateDistance(coordinates, location.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = location;
    }
  }

  // Return different descriptions based on distance
  if (nearestLocation && minDistance <= nearestLocation.radius) {
    return nearestLocation.name;
  } else if (nearestLocation && minDistance <= 200) {
    return `Near ${nearestLocation.name}`;
  } else {
    return `Unknown Location (${coordinates[0].toFixed(5)}° N, ${coordinates[1].toFixed(5)}° E)`;
  }
}

// Enhanced component to handle map clicks for point selection
function PointSelector({ onPointSelect, selectingPoint }) {
  useMapEvents({
    click(e) {
      if (selectingPoint) {
        const coordinates = [e.latlng.lat, e.latlng.lng];
        const locationName = getLocationName(coordinates);
        
        onPointSelect(selectingPoint, coordinates, locationName);
      }
    }
  });
  
  return null;
}

// Component to handle manual zoom controls
function ZoomController({ handleZoomIn, handleZoomOut, setMapZoom }) {
  const map = useMap();
  
  // Listen to zoom events to update state
  useMapEvents({
    zoom: () => {
      setMapZoom(map.getZoom());
    }
  });
  
  // Set up the manual zoom handlers
  useEffect(() => {
    const zoomIn = () => {
      map.setZoom(map.getZoom() + 1);
    };
    
    const zoomOut = () => {
      map.setZoom(map.getZoom() - 1);
    };
    
    // Connect the handlers
    handleZoomIn.current = zoomIn;
    handleZoomOut.current = zoomOut;
    
    return () => {
      handleZoomIn.current = null;
      handleZoomOut.current = null;
    };
  }, [map, handleZoomIn, handleZoomOut]);
  
  return null;
}

// GeocachePopup component - Separate component for Geocache Popup
const GeocachePopup = ({ cache, openImageValidation }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Extract the part of the name after the dash
  const cacheName = cache.name.includes('–') 
    ? cache.name.split('–')[1].trim() 
    : cache.name;
  
  return (
    <div className="p-2 max-w-xs">
      {/* Cache name (extracted part after the dash) */}
      <h3 className="font-bold text-gray-800 mb-1">{cacheName}</h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-2">{cache.description}</p>
      
      {/* Difficulty with stars */}
      <div className="flex items-center mb-2">
        <span className="text-sm text-gray-600 mr-2">Difficulty:</span>
        <div className="flex">
          {Array.from({ length: cache.difficulty }).map((_, i) => (
            <span key={i} className="text-yellow-500">★</span>
          ))}
          {Array.from({ length: 3 - cache.difficulty }).map((_, i) => (
            <span key={i} className="text-gray-300">★</span>
          ))}
        </div>
      </div>
      
      {/* Estimated time */}
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Time:</span> {cache.estimatedTime}
      </p>
      
      {/* Toggle button for task and validation */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded mb-2 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide details' : 'Show details'}
      </button>
      
      {/* Task and validation section - conditionally shown */}
      {showDetails && (
        <div className="mt-2 border-t border-white-200 pt-2">
          <h4 className="font-semibold text-gray-700 text-sm mb-1">Task:</h4>
          <p className="text-sm text-gray-600 mb-2">{cache.task}</p>
          
          <h4 className="font-semibold text-gray-700 text-sm mb-1">Validation Criteria:</h4>
          <p className="text-sm text-gray-600">{cache.validation}</p>
        </div>
      )}
      
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg mt-3 w-full font-medium transition-colors flex items-center justify-center"
        onClick={() => openImageValidation(cache.id)}
      >
        <Camera className="w-4 h-4 mr-2" />
        Validate Find
      </button>
    </div>
  );
};

const Map = ({ 
  activeTab, 
  selectedCache,
  setSelectedCache, 
  openImageValidation,
  onPointSelect,
  startPoint,
  endPoint,
  startPointName,
  endPointName,
  selectingPoint,
  selectedDifficulty,
  routeCoordinates,
  routeType
}) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [coordinates, setCoordinates] = useState({ lat: 40.3632, lng: 49.8381 });
  const [mapZoom, setMapZoom] = useState(17);
  const [userLocation, setUserLocation] = useState(null);
  const [centerOnUser, setCenterOnUser] = useState(false); // Set to false by default to avoid auto-centering
  
  // Refs for zoom handlers
  const handleZoomInRef = useRef(null);
  const handleZoomOutRef = useRef(null);
  
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
  
  // Handlers for the zoom buttons - these will be connected to actual map zoom functions
  const handleZoomIn = () => {
    if (handleZoomInRef.current) {
      handleZoomInRef.current();
    }
  };
  
  const handleZoomOut = () => {
    if (handleZoomOutRef.current) {
      handleZoomOutRef.current();
    }
  };
  
  const handleCenterOnUser = () => {
    if (userLocation) {
      setCenterOnUser(true);
    } else {
      console.log('User location not available yet');
    }
  };

  // Filter geocaches based on selected difficulty
  const filteredCaches = sampleCaches.filter(cache => {
    if (selectedDifficulty === 'all') return true;
    if (selectedDifficulty === 'easy') return cache.difficulty === 1;
    if (selectedDifficulty === 'medium') return cache.difficulty === 2;
    if (selectedDifficulty === 'hard') return cache.difficulty === 3;
    return true;
  });

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
    <div className="h-screen w-[calc(165vh-50px)] relative">
      {/* Selection instruction banner */}
      {selectingPoint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001] bg-black/80 text-white py-2 px-4 rounded-lg text-center">
          Click on the map to select {selectingPoint === 'start' ? 'starting point (A)' : 'destination point (B)'}
        </div>
      )}
    
      {/* OpenStreetMap implementation with React Leaflet focused on Icherisheher */}
      <MapContainer 
        center={icherisheherCenter} 
        zoom={17}
        maxZoom={22}
        minZoom={15}
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
        
        {/* IMPORTANT: Use InitialMapView instead of MapController to set initial view without forcing recenter */}
        <InitialMapView center={icherisheherCenter} zoom={mapZoom} />
        
        {/* Custom zoom controller */}
        <ZoomController 
          handleZoomIn={handleZoomInRef}
          handleZoomOut={handleZoomOutRef}
          setMapZoom={setMapZoom}
        />
        
        {/* Add the FocusSelectedCache component when in geocaching mode */}
        {activeTab === 'geocaching' && (
          <FocusSelectedCache selectedCache={selectedCache} />
        )}
        
        {/* Point selector component */}
        <PointSelector 
          onPointSelect={onPointSelect}
          selectingPoint={selectingPoint}
        />
        
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
                    {getLocationName(userLocation.position)}
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
        
        {/* Display starting point marker if set and in navigation tab */}
        {startPoint && activeTab === 'navigation' && (
          <Marker position={startPoint} icon={startPointIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-800">Starting Point (A)</h3>
                <p className="text-sm text-gray-600">
                  {startPointName || getLocationName(startPoint)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Display destination marker if set and in navigation tab */}
        {endPoint && activeTab === 'navigation' && (
          <Marker position={endPoint} icon={endPointIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-800">Destination (B)</h3>
                <p className="text-sm text-gray-600">
                  {endPointName || getLocationName(endPoint)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* NEW: Add the RouteDisplay component when route coordinates are available */}
        {routeCoordinates && routeType && activeTab === 'navigation' && (
          <RouteDisplay 
            routeCoordinates={routeCoordinates} 
            routeType={routeType}
          />
        )}
        
        {/* Display key landmarks on the map only when in navigation tab */}
        {activeTab === 'navigation' && keyLandmarks.map((landmark, index) => (
          <Marker 
            key={`landmark-${index}`}
            position={landmark.position}
            icon={L.divIcon({
              className: 'landmark-icon',
              html: `<div class="flex items-center justify-center" style="width: 32px; height: 32px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
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
        {activeTab === 'geocaching' && filteredCaches.map(cache => {
          // Check if this cache is the selected one
          const isSelected = selectedCache === cache.name ||
            (cache.name.includes('–') && cache.name.split('–')[1].trim() === selectedCache);
            
          return (
            <Marker 
              key={`cache-${cache.id}`}
              position={cache.position}
              icon={createCacheIcon(cache.difficulty, isSelected)}
              eventHandlers={{
                click: () => setSelectedCache(cache.name)
              }}
              // Add z-index to make selected cache appear on top
              zIndexOffset={isSelected ? 1000 : 0}
            >
              <Popup>
                <GeocachePopup 
                  cache={cache} 
                  openImageValidation={openImageValidation} 
                />
              </Popup>
            </Marker>
          );
        })}
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

// Add PropTypes for the RouteDisplay component
RouteDisplay.propTypes = {
  routeCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  routeType: PropTypes.string
};

RouteDisplay.defaultProps = {
  routeCoordinates: null,
  routeType: 'quickest'
};

// Add PropTypes for the new FocusSelectedCache component
FocusSelectedCache.propTypes = {
  selectedCache: PropTypes.string
};

// Add PropTypes for GeocachePopup component
GeocachePopup.propTypes = {
  cache: PropTypes.object.isRequired,
  openImageValidation: PropTypes.func.isRequired
};

Map.propTypes = {
  activeTab: PropTypes.string.isRequired,
  selectedCache: PropTypes.string,
  setSelectedCache: PropTypes.func.isRequired,
  openImageValidation: PropTypes.func.isRequired,
  onPointSelect: PropTypes.func,
  startPoint: PropTypes.array,
  endPoint: PropTypes.array,
  startPointName: PropTypes.string,
  endPointName: PropTypes.string,
  selectingPoint: PropTypes.string,
  selectedDifficulty: PropTypes.string,
  routeCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  routeType: PropTypes.string
};

Map.defaultProps = {
  onPointSelect: () => {},
  startPoint: null,
  endPoint: null,
  startPointName: null,
  endPointName: null,
  selectingPoint: null,
  selectedDifficulty: 'all',
  routeCoordinates: null,
  routeType: null
};

InitialMapView.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired
};

LocationTracker.propTypes = {
  setUserLocation: PropTypes.func.isRequired,
  centerOnUser: PropTypes.bool.isRequired,
  setCenterOnUser: PropTypes.func.isRequired
};


PointSelector.propTypes = {
  onPointSelect: PropTypes.func.isRequired,
  selectingPoint: PropTypes.string
};

ZoomController.propTypes = {
  handleZoomIn: PropTypes.object.isRequired,
  handleZoomOut: PropTypes.object.isRequired,
  setMapZoom: PropTypes.func.isRequired
};

export default Map;