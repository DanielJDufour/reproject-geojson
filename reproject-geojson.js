const proj4 = require("proj4-fully-loaded");

const clone = data => JSON.parse(JSON.stringify(data));

function reprojectGeoJSON(data, { from: _from = "EPSG:4326", in_place = false, to: _to = "EPSG:4326" }) {
  if (typeof _from === "number" || _from.match(/^\d+$/)) _from = "EPSG:" + _from;
  if (typeof _to === "number" || _to.match(/^\d+$/)) _to = "EPSG:" + _to;

  const fwd = proj4(_from, _to).forward;

  if (in_place !== true) data = clone(data);

  if (data.type === "FeatureCollection") {
    data.features = data.features.map(feature => reprojectGeoJSON(feature, { from: _from, to: _to, in_place }));
  } else if (data.type === "Feature") {
    data.geometry = reprojectGeoJSON(data.geometry, { from: _from, to: _to, in_place });
  } else if (data.type === "LineString") {
    data.coordinates = data.coordinates.map(fwd);
  } else if (data.type === "MultiLineString") {
    data.coordinates = data.coordinates.map(line => line.map(fwd));
  } else if (data.type === "MultiPoint") {
    data.coordinates = data.coordinates.map(fwd);
  } else if (data.coordinates === "MultiPolygon") {
    data.coordinates = data.coordinates.map(polygon => {
      return polygon.map(ring => ring.map(fwd));
    });
  } else if (data.type === "Point") {
    data.coordinates = fwd(data.coordinates);
  } else if (data.type === "Polygon") {
    data.coordinates = data.coordinates.map(ring => ring.map(fwd));
  }
  return data;
}

if (typeof define === "function" && define.amd)
  define(function () {
    return reprojectGeoJSON;
  });
if (typeof module === "object") module.exports = reprojectGeoJSON;
if (typeof window === "object") window.reprojectGeoJSON = reprojectGeoJSON;
if (typeof self === "object") self.reprojectGeoJSON = reprojectGeoJSON;
