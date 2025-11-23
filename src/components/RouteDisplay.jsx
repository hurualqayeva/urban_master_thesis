// src/components/RouteDisplay.jsx
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const RouteDisplay = ({ routeCoordinates, routeType }) => {
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
};

RouteDisplay.propTypes = {
  routeCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  routeType: PropTypes.string
};

RouteDisplay.defaultProps = {
  routeCoordinates: [],
  routeType: 'quickest'
};

export default RouteDisplay;