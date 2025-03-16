// src/App.jsx
import { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import GeocachingPanel from './components/GeocachingPanel';
import Map from './components/Map';

function App() {
  const [activeTab, setActiveTab] = useState('navigation');
  const [selectedCache, setSelectedCache] = useState(null);
  // Function for image validation as required by the Map component
  const openImageValidation = () => {
    // Your image validation logic here
    console.log('Image validation opened');
    // You might want to set some state or perform an action here
  };

  return (
    <div 
      className="relative flex h-screen" 
      style={{

        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Optional: Add a semi-transparent overlay */}
   
      <div className="relative z-10 w-64 bg-gray-900/80 text-white flex flex-col">
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
          <NavigationPanel />
        ) : (
          <GeocachingPanel 
            selectedCache={selectedCache}
            onSelectCache={setSelectedCache}
          />
        )}
      </div>

      {/* Map area */}
      <div className="relative flex-1">
        <Map 
          activeTab={activeTab}
          selectedCache={selectedCache}
          setSelectedCache={setSelectedCache}
          openImageValidation={openImageValidation}
        />
      </div>
    </div>
  );
}

export default App;