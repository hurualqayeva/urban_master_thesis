// src/App.jsx
import { useState} from 'react';
import NavigationPanel from './components/NavigationPanel';
import GeocachingPanel from './components/GeocachingPanel';
import Map from './components/Map';
import ImageValidationModal from './components/ImageValidationModel';
import 'leaflet/dist/leaflet.css';
import { fetchRouteData  } from './services/neo4jservice';

function App() {
  const [activeTab, setActiveTab] = useState('navigation');
  const [selectedCache, setSelectedCache] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // State for point selection
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [startPointName, setStartPointName] = useState('');
  const [endPointName, setEndPointName] = useState('');
  const [selectingPoint, setSelectingPoint] = useState(null); // 'start', 'end', or null

  // State for Neo4j integration
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Image validation state
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [currentCacheId, setCurrentCacheId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Format location data for display in the NavigationPanel
  const formatLocationData = (coords, name) => {
    if (!coords) return '';
    return name || `${coords[0].toFixed(5)}° N, ${coords[1].toFixed(5)}° E`;
  };

  // Function to handle point selection on the map
  const handlePointSelect = (type, coordinates, locationName) => {
    if (type === 'start') {
      setStartPoint(coordinates);
      setStartPointName(locationName);
      setSelectingPoint('end'); // After selecting start, switch to selecting end
    } else if (type === 'end') {
      setEndPoint(coordinates);
      setEndPointName(locationName);
      setSelectingPoint(null); // Done selecting points
    }
    
    // Clear any existing route when points change
    setRouteCoordinates(null);
    setSelectedRouteType(null);
    setRouteError(null);
  };

  // Reset both points
  const handleResetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setStartPointName('');
    setEndPointName('');
    setSelectingPoint('start'); // Start over with selecting the start point
    
    // Clear any existing route
    setRouteCoordinates(null);
    setSelectedRouteType(null);
    setRouteError(null);
  };

  // Open the image validation modal
  const openImageValidation = (cacheId) => {
    setCurrentCacheId(cacheId);
    setValidationModalOpen(true);
  };

  // Handle validation success
  const handleValidationSuccess = () => {
    setSuccessMessage(`You've successfully found the geocache! Great job!`);
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  // Handle difficulty change from GeocachingPanel
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  
  // Handle starting navigation with a selected route
  const handleStartNavigation = async (routeType) => {
    console.log(`Starting navigation with route type: ${routeType}`);
    console.log(`From: ${startPoint} (${startPointName}) To: ${endPoint} (${endPointName})`);
  
    setSelectedRouteType(routeType);
    setIsLoadingRoute(true);
    setRouteError(null);
  
    try {
      const routeData = await fetchRouteData(routeType, startPoint, endPoint); // <--- FETCH
      if (routeData && routeData.length > 0) {
        console.log(`Route found with ${routeData.length} points`);
        setRouteCoordinates(routeData); // <--- SEND DATA TO MAP
      } else {
        setRouteError("No route found between these points.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      setRouteError("Failed to load route from server.");
    } finally {
      setIsLoadingRoute(false);
    }
  };
  

  return (
    <div 
      className="relative flex h-screen" 
      style={{
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Left sidebar */}
      <div className="relative z-20 w-80 bg-gray-900/80 text-white flex flex-col">
        {/* Tab navigation */}
        <div className="flex text-center">
          <button 
            className={`flex-1 py-4 ${activeTab === 'navigation' ? 'bg-blue-500' : 'bg-gray-800/80'}`}
            onClick={() => setActiveTab('navigation')}
          >
            Route
          </button>
          <button 
            className={`flex-1 py-4 ${activeTab === 'geocaching' ? 'bg-blue-500' : 'bg-gray-800/80'}`}
            onClick={() => setActiveTab('geocaching')}
          >
            Game
          </button>
        </div>

        {/* Show the appropriate panel based on active tab */}
        {activeTab === 'navigation' ? (
          <NavigationPanel 
            startPoint={formatLocationData(startPoint, startPointName)}
            endPoint={formatLocationData(endPoint, endPointName)}
            onFindRoutes={() => {
              // Your route finding logic here
              if (startPoint && endPoint) {
                console.log('Finding routes between', startPointName || startPoint, 'and', endPointName || endPoint);
                return true; // Return true to show the routes popup
              } else {
                console.log('Please select both points');
                return false;
              }
            }}
            onResetPoints={handleResetPoints}
            onSelectPoint={(pointType) => setSelectingPoint(pointType)}
            onStartNavigation={handleStartNavigation} // Add this line to handle route selection
            isLoadingRoute={isLoadingRoute}
          />
        ) : (
          <GeocachingPanel 
            selectedCache={selectedCache}
            onSelectCache={setSelectedCache}
            onDifficultyChange={handleDifficultyChange}
          />
        )}
      </div>

      {/* Map area */}
      <div className="relative inset-0 z-0 flex-1">
        {/* Success Message if any */}
        {successMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
        
        {/* Route Error Message if any */}
        {routeError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-600 text-white px-4 py-2 rounded-md shadow-lg">
            {routeError}
          </div>
        )}
        
        {/* Loading indicator for route */}
        {isLoadingRoute && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading route from Neo4j...
          </div>
        )}
        
        <Map 
          activeTab={activeTab}
          selectedCache={selectedCache}
          setSelectedCache={setSelectedCache}
          openImageValidation={openImageValidation}
          onPointSelect={handlePointSelect}
          startPoint={startPoint}
          endPoint={endPoint}
          startPointName={startPointName}
          endPointName={endPointName}
          selectingPoint={activeTab === 'navigation' ? selectingPoint : null}
          selectedDifficulty={selectedDifficulty}
          routeCoordinates={routeCoordinates}
          routeType={selectedRouteType}
        />
      </div>

      {/* Image Validation Modal */}
      {validationModalOpen && (
        <ImageValidationModal
          cacheId={currentCacheId}
          onClose={() => setValidationModalOpen(false)}
          onSuccess={handleValidationSuccess}
        />
      )}
    </div>
  );
}

export default App;