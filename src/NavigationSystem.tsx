import React, { useState } from "react";
import {
  Menu,
  X,
  Clock,
  Filter,
  ZoomIn,
  ZoomOut,
  Layers,
  Maximize2,
  Send
} from "lucide-react";

// Import React components but avoid direct imports from react-leaflet
const Map: React.FC = () => {
  // This is a placeholder for the actual map component
  // We'll use a div that explains how to add the map manually
  return (
    <div className="h-full w-full bg-gray-700 flex items-center justify-center text-center p-4">
      <div>
        <h3 className="text-xl font-bold mb-4">OpenStreetMap Implementation</h3>
        <p className="max-w-md mx-auto">
          To add OpenStreetMap, manually set up Leaflet in your project by following these steps:
        </p>
        <ol className="text-left list-decimal ml-8 mt-4 space-y-2">
          <li>Install leaflet: <code className="bg-gray-800 px-2 py-1 rounded">npm install leaflet</code></li>
          <li>Add leaflet CSS in your index.html or import it in your main file</li>
          <li>Create a map instance when the component mounts</li>
          <li>Set up your tile layer with OpenStreetMap URL</li>
          <li>Add markers for points of interest</li>
        </ol>
        <div className="mt-6 p-4 bg-gray-800 rounded text-left overflow-auto">
          <pre>{`// Sample code to initialize map
import L from 'leaflet';

// In your component:
useEffect(() => {
  // Create map
  const map = L.map('map-container').setView([40.3661, 49.8372], 15);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add marker
  L.marker([40.3668, 49.8371]).addTo(map)
    .bindPopup('Maiden Tower');
    
  // Clean up
  return () => map.remove();
}, []);`}</pre>
        </div>
      </div>
    </div>
  );
};

const NavigationSystem: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(15);
  
  const categories = [
    { id: "roads", name: "Roads", icon: "🛣️" },
    { id: "parks", name: "Parks", icon: "🌳" },
    { id: "museums", name: "Museums", icon: "🏛️" },
    { id: "accommodation", name: "Hotels & Hostels", icon: "🏨" },
    { id: "emergency", name: "Emergency Points", icon: "🚨", alwaysVisible: true },
    { id: "education", name: "Educational Buildings", icon: "🎓" },
    { id: "food", name: "Restaurants & Cafes", icon: "🍽️" },
    { id: "historical", name: "Historical Buildings", icon: "⛪" },
    { id: "government", name: "Government Buildings", icon: "🏛️" },
  ];
  
  const routes = [
    { name: "Quickest Route", time: "15 min", distance: "1.2 km" },
    { name: "Historical Route", time: "25 min", distance: "2.0 km" },
    { name: "Cultural Route", time: "30 min", distance: "2.4 km" },
    { name: "Tourist-friendly Route", time: "20 min", distance: "1.6 km" },
    { name: "Scenic Route", time: "35 min", distance: "2.8 km" },
  ];

  // Helper function to check if a category is selected
  const isCategorySelected = (id: string): boolean => {
    return selectedCategories.indexOf(id) !== -1;
  };

  // Handle map zoom
  const handleZoomIn = (): void => {
    setMapZoom(prevZoom => (prevZoom < 19 ? prevZoom + 1 : prevZoom));
  };

  const handleZoomOut = (): void => {
    setMapZoom(prevZoom => (prevZoom > 10 ? prevZoom - 1 : prevZoom));
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex relative">
      {/* Hamburger Button (Only Visible When Sidebar is Collapsed) */}
      {!isSidebarOpen && (
        <button
          className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full bg-black shadow-lg z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-white">Navigation</h2>
          <button
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Search Inputs */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Starting point (A)"
                className="w-full p-2 rounded-lg border bg-gray-800 text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Destination (B)"
                className="w-full p-2 rounded-lg border bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setIsPopupVisible(true)}
              >
                Find Routes
              </button>
            </div>

            {/* Categories */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Categories</h3>
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      isCategorySelected(category.id)
                        ? "bg-blue-500"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        isCategorySelected(category.id)
                          ? prev.filter((id) => id !== category.id)
                          : [...prev, category.id]
                      )
                    }
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="text-white">{category.name}</span>
                    {category.alwaysVisible && (
                      <span className="ml-auto text-xs text-gray-400">
                        Always visible
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Menu for Routes */}
      {isPopupVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Available Routes</h2>
              <button
                className="text-white hover:text-gray-400"
                onClick={() => setIsPopupVisible(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 flex flex-col justify-between items-start cursor-pointer ${
                    selectedRoute === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedRoute(index)}
                >
                  <h3 className="font-semibold">{route.name}</h3>
                  <p className="text-sm">
                    {route.time} • {route.distance}
                  </p>
                  <Send
                    className={`w-5 h-5 mt-2 ${
                      selectedRoute === index ? "text-white" : "text-blue-500"
                    }`}
                  />
                </div>
              ))}
            </div>
            <button
              className={`w-full mt-4 px-4 py-2 ${
                selectedRoute !== null
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              } rounded-lg`}
              onClick={() => setIsPopupVisible(false)}
              disabled={selectedRoute === null}
            >
              Start Navigation
            </button>
          </div>
        </div>
      )}

      {/* Main Content: Map, Controls */}
      <div className="flex-1 relative">
        {/* Map Implementation */}
        <div style={{ height: "100%", width: "100%" }}>
          <Map />
        </div>

        {/* Top-Right Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <button 
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700" 
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700" 
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <Layers className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Text Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 py-2 px-4 flex justify-between items-center z-10">
          <span>Zoom: {mapZoom}x</span>
          <span>40.3661° N 49.8372° E</span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            Last updated: 2 mins ago
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavigationSystem;