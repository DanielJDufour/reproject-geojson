const getDepth = require("get-depth");

function reprojectGeoJSONPluggable(data, { reproject }) {
  if (typeof reproject !== "function") {
    throw new Error(`[reproject-geojson] you must specify a reproject function`);
  }
  if (data.type === "FeatureCollection") {
    return {
      ...data,
      features: data.features.map(feature => reprojectGeoJSONPluggable(feature, { reproject }))
    };
  } else if (data.type === "Feature") {
    return {
      ...data,
      geometry: reprojectGeoJSONPluggable(data.geometry, { reproject })
    };
  } else if (data.type === "LineString") {
    return {
      ...data,
      coordinates: data.coordinates.map(coord => reproject(coord))
    };
  } else if (data.type === "MultiLineString") {
    return {
      ...data,
      coordinates: data.coordinates.map(line => line.map(coord => reproject(coord)))
    };
  } else if (data.type === "MultiPoint") {
    return {
      ...data,
      coordinates: data.coordinates.map(point => reproject(point))
    };
  } else if (data.type === "MultiPolygon") {
    return {
      ...data,
      coordinates: data.coordinates.map(polygon => {
        return polygon.map(ring => ring.map(coord => reproject(coord)));
      })
    };
  } else if (data.type === "Point") {
    return {
      ...data,
      coordinates: reproject(data.coordinates)
    };
  } else if (data.type === "Polygon") {
    return {
      ...data,
      coordinates: data.coordinates.map(ring => ring.map(coord => reproject(coord)))
    };
  } else if (Array.isArray(data)) {
    const depth = getDepth(data);

    if (depth === 1) {
      // coord
      return reproject(data);
    } else if (depth === 2) {
      // ring
      return data.map(coord => reproject(coord));
    } else if (depth === 3) {
      // polygon
      return data.map(ring => ring.map(coord => reproject(coord)));
    } else if (depth === 4) {
      // multi-polygon
      return data.map(polygon => {
        return polygon.map(ring => ring.map(coord => reproject(coord)));
      });
    }
  }
  return data;
}

if (typeof define === "function" && define.amd)
  define(function () {
    return reprojectGeoJSONPluggable;
  });
if (typeof module === "object") module.exports = reprojectGeoJSONPluggable;
if (typeof window === "object") window.reprojectGeoJSONPluggable = reprojectGeoJSONPluggable;
if (typeof self === "object") self.reprojectGeoJSONPluggable = reprojectGeoJSONPluggable;
