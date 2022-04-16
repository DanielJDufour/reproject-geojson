const clone = data => JSON.parse(JSON.stringify(data));

function reprojectGeoJSONPluggable(data, { in_place = false, reproject }) {
  if (typeof reproject !== "function") {
    throw new Error(`[reproject-geojson] you must specify a reproject function`);
  }
  if (in_place !== true) data = clone(data);

  if (data.type === "FeatureCollection") {
    data.features = data.features.map(feature => reprojectGeoJSONPluggable(feature, { in_place, reproject }));
  } else if (data.type === "Feature") {
    data.geometry = reprojectGeoJSONPluggable(data.geometry, { in_place, reproject });
  } else if (data.type === "LineString") {
    data.coordinates = data.coordinates.map(coord => reproject(coord));
  } else if (data.type === "MultiLineString") {
    data.coordinates = data.coordinates.map(line => line.map(coord => reproject(coord)));
  } else if (data.type === "MultiPoint") {
    data.coordinates = data.coordinates.map(point => reproject(point));
  } else if (data.type === "MultiPolygon") {
    data.coordinates = data.coordinates.map(polygon => {
      return polygon.map(ring => ring.map(coord => reproject(coord)));
    });
  } else if (data.type === "Point") {
    data.coordinates = reproject(data.coordinates);
  } else if (data.type === "Polygon") {
    data.coordinates = data.coordinates.map(ring => ring.map(coord => reproject(coord)));
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
