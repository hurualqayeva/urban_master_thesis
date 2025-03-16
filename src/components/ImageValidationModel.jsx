// src/components/ImageValidationModal.jsx
import React, { useState } from 'react';
import GeocachingSystem from '../models/GeocachingSystem';

const geocachingSystem = new GeocachingSystem();

const ImageValidationModal = ({ cacheId, onClose, onSuccess }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);
  
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
    if (!image) return;
    
    setValidating(true);
    
    try {
      // In a real app, you would send the image to a server
      // Here we're using our local geocaching system to simulate validation
      const validationResult = await geocachingSystem.validateImage(cacheId, image);
      setResult(validationResult);
      
      // If successful, record the attempt
      if (validationResult.success) {
        geocachingSystem.recordAttempt('user1', cacheId, true, 120); // 120 seconds is an example time
        
        // Notify parent component
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        success: false,
        accuracy: 0,
        message: "An error occurred during validation."
      });
    } finally {
      setValidating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Validate Your Find</h2>
        
        <p className="mb-4">
          Take a photo of the cache location to validate your discovery.
        </p>
        
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
                className={`px-4 py-2 rounded text-white ${
                  !image || validating ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {validating ? 'Validating...' : 'Validate'}
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
                <div className="text-sm">Accuracy: {result.accuracy}%</div>
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

export default ImageValidationModal;