import { parseWKT } from '../components/wktParser';

export async function fetchRouteData(routeType, startPoint, endPoint) {
  try {
    const response = await fetch('http://localhost:8000/get_routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start: [startPoint[1], startPoint[0]],
        target: [endPoint[1], endPoint[0]]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch route: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched full route data:', data);

    const selectedRoute = getRouteBasedOnType(routeType, data);

    let parsedCoordinates = [];

    if (Array.isArray(selectedRoute)) {
      for (const feature of selectedRoute) {
        if (feature.geometry && feature.geometry.startsWith('LINESTRING')) { 
          // 🛑 SKIP POINTS, ONLY PROCESS LINESTRINGS
          const coords = parseWKT(feature.geometry);
          parsedCoordinates.push(coords);
        }
      }
    }

    console.log('Parsed route coordinates (lines only):', parsedCoordinates);

    return parsedCoordinates; // Now it returns ONLY arrays of LineStrings
  } catch (error) {
    console.error('Error fetching route data:', error);
    throw error;
  }
}

/**
 * Select route data based on route type
 */
export function getRouteBasedOnType(routeType, fetchedData) {
  switch (routeType) {
    case 'quickest':
      return fetchedData.shortest_path;
    case 'historical':
      return fetchedData.cultural_path;
    case 'geocaching':
      return fetchedData.cache_path;
    case 'closest_cache':
      return fetchedData.closest_cache;
    default:
      console.warn(`Unknown routeType '${routeType}', defaulting to shortest_path.`);
      return fetchedData.shortest_path;
  }
}
