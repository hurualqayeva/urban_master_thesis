// src/components/ImageValidationModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Camera, X } from 'lucide-react';

// API endpoint for validation
const API_URL = 'http://localhost:5000/api/validate';

const ImageValidationModal = ({ cacheId, onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  
  // Handle image validation
  const validateImage = async () => {
    if (!image || !previewUrl) return;
    
    setValidating(true);
    setError(null);
    
    try {
      console.log('Sending validation request for cache ID:', cacheId);
      console.log('Image data preview:', previewUrl.substring(0, 50) + '...');
      
      // Send the image to the backend for validation
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cacheId: cacheId,
          imageData: previewUrl // Send the base64 encoded image data
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const validationResult = await response.json();
      console.log('Validation result:', validationResult);
      
      setResult(validationResult);
      
      // If successful, notify parent component
      if (validationResult.success && onSuccess) {
        onSuccess(cacheId);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setError(error.message || 'An error occurred during validation');
      setResult(null);
    } finally {
      setValidating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Validate Your Find</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} color='white' />
          </button>
        </div>
        
        <p className="mb-4">
          Take a photo of the cache location to validate your discovery.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {!result && (
          <>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            
            {previewUrl && (
              <div className="mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-48 rounded mx-auto"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={validateImage}
                disabled={!image || validating}
                className={`px-4 py-2 rounded text-white flex items-center ${
                  !image || validating ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {validating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2" size={18} />
                    Validate
                  </>
                )}
              </button>
            </div>
          </>
        )}
        
        {result && (
          <div className={`p-4 rounded mb-4 ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h3 className="font-bold mb-2">
              {result.success ? 'Success!' : 'Validation Failed'}
            </h3>
            <p>{result.message}</p>
            {result.accuracy > 0 && (
              <div className="mt-2">
                <div className="text-sm">Accuracy: {result.accuracy.toFixed(1)}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.success ? 'bg-green-600' : 'bg-red-600'
                    }`} 
                    style={{ width: `${result.accuracy}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {result.success ? 'Awesome!' : 'Try Again'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ImageValidationModal.propTypes = {
  cacheId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default ImageValidationModal;