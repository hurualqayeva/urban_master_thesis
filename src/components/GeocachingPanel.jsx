// src/components/GeocachingPanel.jsx
import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import PropTypes from 'prop-types'; // Import PropTypes
import jsonData from './GeocachingData.json';

const sampleCaches = jsonData.geocaches;

// Cache item component
const GeoCache = ({ name, difficulty, isActive, onSelectCache }) => {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-md mb-2 cursor-pointer hover:bg-blue-600 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}
      onClick={() => onSelectCache(name)}
    >
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm flex items-center">{[...Array(difficulty)].map((_, i) => (<Star key={i} size={14} className="text-yellow-300 fill-yellow-300" />))}
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
  distance: PropTypes.number,
  difficulty: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelectCache: PropTypes.func.isRequired
};

const GeocachingPanel = ({ selectedCache, onSelectCache, onDifficultyChange }) => {
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

  // Function to handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    // Pass the selected difficulty to parent component
    onDifficultyChange(difficulty);
  };

  return (
    <div className="p-3 bg-gray-800 flex-2 overflow-y-auto">
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
        onClick={() => handleDifficultyChange('all')}
      >
        All Caches
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'easy' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => handleDifficultyChange('easy')}
      >
        Easy (<Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'medium' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => handleDifficultyChange('medium')}
      >
        Medium (<Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <button 
        className={`w-full text-left p-3 rounded mb-2 ${selectedDifficulty === 'hard' ? 'bg-blue-500' : 'bg-gray-700'}`}
        onClick={() => handleDifficultyChange('hard')}
      >
        Hard (<Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" /><Star size={14} className="inline text-yellow-300 fill-yellow-300" />)
      </button>
      
      <h3 className="font-medium mt-4 mb-2">Active Caches</h3>
      
      {filteredCaches.map(cache => (
        <GeoCache 
          key={cache.id}
          name={cache.name.includes('–') 
            ? cache.name.split('–')[1].trim() 
            : cache.name}
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
  onSelectCache: PropTypes.func.isRequired,
  onDifficultyChange: PropTypes.func.isRequired
};

export default GeocachingPanel;