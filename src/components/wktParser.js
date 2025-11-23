// src/services/wktParser.js

export function parseWKT(wkt) {
  if (wkt.startsWith('LINESTRING')) {
    const raw = wkt.replace('LINESTRING (', '').replace(')', '').trim();
    const points = raw.split(',').map(pair => {
      const [x, y] = pair.trim().split(/\s+/).map(Number);
      return [y, x]; // Leaflet wants [lat, lon]
    });
    return points;
  }

  if (wkt.startsWith('POINT')) {
    const raw = wkt.replace('POINT (', '').replace(')', '').trim();
    const [x, y] = raw.split(/\s+/).map(Number);
    return [[y, x]]; // Return array of one point
  }

  console.error('❌ Invalid or unsupported geometry:', wkt);
  return []; // return empty array on error
}
