// src/components/NavigationPanel.jsx

const NavigationPanel = () => {
  return (
    <div className="p-3 bg-gray-800 flex-1 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Starting point (A)</label>
        <input 
          type="text" 
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter starting point"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Destination (B)</label>
        <input 
          type="text" 
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter destination"
        />
      </div>
      
      <button className="w-full bg-blue-500 py-3 rounded text-white font-medium mb-4 hover:bg-blue-600">
        Find Routes
      </button>
      
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        
        <div className="space-y-2">
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🚗</span>
            <span>Roads</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🌳</span>
            <span>Parks</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🏛️</span>
            <span>Museums</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🏨</span>
            <span>Hotels & Hostels</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🚨</span>
            <span>Emergency Points</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🏫</span>
            <span>Educational Buildings</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🍽️</span>
            <span>Restaurants & Cafes</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🏰</span>
            <span>Historical Buildings</span>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
            <span className="mr-2">🏢</span>
            <span>Government Buildings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;