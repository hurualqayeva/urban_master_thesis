// src/components/GeocachingPanel.jsx
import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import PropTypes from 'prop-types'; // Import PropTypes

// Sample cache data
const sampleCaches = [
  { id: 1, name: 'Hidden Fortress', distance: 120, difficulty: 1, coordinates: [40.3661, 49.8372] },
  { id: 2, name: 'Ancient Path', distance: 350, difficulty: 2, coordinates: [40.3659, 49.8375] },
  { id: 3, name: 'Secret Garden', distance: 500, difficulty: 3, coordinates: [40.3665, 49.8380] },
  { id: 4, name: 'Maiden Tower Secret', distance: 280, difficulty: 3, coordinates: [40.3668, 49.8385] }
];

// Cache item component
const GeoCache = ({ name, distance, difficulty, isActive, onSelectCache }) => {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-md mb-2 cursor-pointer hover:bg-blue-600 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}
      onClick={() => onSelectCache(name)}
    >
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm flex items-center">
          {distance}m · {' '}
          {[...Array(difficulty)].map((_, i) => (
            <Star key={i} size={14} className="text-yellow-300 fill-yellow-300" />
          ))}
        </div>
      </div>
      <button className="text-white bg-blue-700 p-2 rounded-full hover:bg-blue-800">
        <MapPin size={16} />
      </button>
    </div>
  );
};

// Add PropTypes validation for GeoCache
GeoCache.propTypes = {
  name: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelectCache: PropTypes.func.isRequired
};

const GeocachingPanel = ({ selectedCache, onSelectCache }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  // Filter caches by difficulty
  const filteredCaches = selectedDifficulty === 'all' 
    ? sampleCaches 
    : sampleCaches.filter(cache => {
        if (selectedDifficulty === 'easy') return cache.difficulty === 1;
        if (selectedDifficulty === 'medium') return cache.difficulty === 2;
        if (selectedDifficulty === 'hard') return cache.difficulty === 3;
        return true;
      });

  return (
    <div className="p-3 bg-gray-800 flex-1 overflow-y-auto">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold">Geocaching</h2>
        <div className="ml-auto flex space-x-2">
          <button className="p-1 bg-gray-700 rounded">
            <Star size={18} />
          </button>
          <button className="p-1 bg-gray-700 rounded">
            <MapPin size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'all' ? 'bg-blue-500' : 'bg-blue-700'}`}
        onClick={() => setSelectedDifficulty('all')}
      >
        All Caches
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'easy' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => setSelectedDifficulty('easy')}
      >
        Easy (<Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'medium' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => setSelectedDifficulty('medium')}
      >
        Medium (<Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'hard' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => setSelectedDifficulty('hard')}
      >
        Hard (<Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <h3 className="font-medium mt-4 mb-2">Active Caches</h3>
      
      {filteredCaches.map(cache => (
        <GeoCache 
          key={cache.id}
          name={cache.name}
          distance={cache.distance}
          difficulty={cache.difficulty}
          isActive={selectedCache === cache.name}
          onSelectCache={onSelectCache}
        />
      ))}
    </div>
  );
};

// Add PropTypes validation for GeocachingPanel
GeocachingPanel.propTypes = {
  selectedCache: PropTypes.string,
  onSelectCache: PropTypes.func.isRequired
};

export default GeocachingPanel;