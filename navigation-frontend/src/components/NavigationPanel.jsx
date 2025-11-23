import { useState } from 'react';
import { X, Filter, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

const NavigationPanel = ({ startPoint, endPoint, onFindRoutes, onResetPoints, onSelectPoint, onStartNavigation }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

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
    {
      type: 'quickest',
      name: 'Quickest Route',
      icon: '⚡',
      time: '15 min',
      distance: '1.2 km',
      description: 'The fastest way'
    },
    {
      type: 'historical',
      name: 'Historical Route',
      icon: '🏛️',
      time: '25 min',
      distance: '2.0 km',
      description: 'Explore historical landmarks'
    },
    {
      type: 'geocaching',
      name: 'Geocaching Route',
      icon: '🔍',
      time: '30 min',
      distance: '2.4 km',
      description: 'Interactive treasure hunt'
    }
  ];
  
  // Helper function to check if a category is selected
  const isCategorySelected = (id) => selectedCategories.indexOf(id) !== -1;

  // Toggle category selection
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      isCategorySelected(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  // Start navigation with selected route
  const startNavigation = () => {
    if (selectedRoute !== null) {
      const routeType = routes[selectedRoute].type;
      console.log(`Starting navigation with route: ${routes[selectedRoute].name}`);
      setIsPopupVisible(false);
      
      // Call the parent component's onStartNavigation handler with the selected route type
      if (onStartNavigation) {
        onStartNavigation(routeType);
      }
    }
  };

  // Handle find routes button click
  const handleFindRoutes = () => {
    if (startPoint && endPoint) {
      setIsPopupVisible(true);
      if (onFindRoutes) onFindRoutes();
    } else {
      alert("Please select both starting point and destination on the map");
    }
  };

  return (
    <div className="p-4 bg-gray-800 flex-1 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-400 mb-2">
          Select your starting point and destination
        </div>
        
        {/* Starting Point with button to initiate map selection */}
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-300">Starting point (A)</span>
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            placeholder="Select starting point"
            value={startPoint || ''}
            readOnly
          />
          <button 
            className="p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            onClick={() => onSelectPoint('start')}
            title="Select on map"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
        
        {/* Destination with button to initiate map selection */}
        <div className="flex items-center mb-2 mt-3">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-300">Destination (B)</span>
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            placeholder="Select destination"
            value={endPoint || ''}
            readOnly
          />
          <button 
            className="p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            onClick={() => onSelectPoint('end')} // Fixed to 'end' 
            title="Select on map"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button 
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            onClick={onResetPoints}
          >
            Reset Points
          </button>
          
          <button 
            className={`flex-1 px-4 py-2 rounded ${
              startPoint && endPoint 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleFindRoutes}
            disabled={!startPoint || !endPoint}
          >
            Find Routes
          </button>
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Categories</h3>
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
              onClick={() => toggleCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              <span>{category.name}</span>
              {category.alwaysVisible && (
                <span className="ml-auto text-xs text-gray-400">
                  Always visible
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Routes Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Available Routes</h2>
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
                    {route.time} • {route.distance} {route.icon}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">{route.description}</p>
                </div>
              ))}
            </div>
            
            <button
              className={`w-full mt-4 px-4 py-2 ${
                selectedRoute !== null
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              } rounded-lg`}
              onClick={startNavigation}
              disabled={selectedRoute === null}
            >
              Start Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

NavigationPanel.propTypes = {
  startPoint: PropTypes.string,
  endPoint: PropTypes.string,
  onFindRoutes: PropTypes.func,
  onResetPoints: PropTypes.func,
  onSelectPoint: PropTypes.func,
  onStartNavigation: PropTypes.func
};

NavigationPanel.defaultProps = {
  startPoint: '',
  endPoint: '',
  onFindRoutes: () => {},
  onResetPoints: () => {},
  onSelectPoint: () => {},
  onStartNavigation: () => {}
};

export default NavigationPanel;