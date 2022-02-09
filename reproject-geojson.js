const proj4 = require("proj4-fully-loaded");
const reprojectGeoJSONPluggable = require("./pluggable.js");

function reprojectGeoJSON(data, { from: _from = "EPSG:4326", in_place = false, to: _to = "EPSG:4326" }) {
  if (typeof _from === "number" || _from.match(/^\d+$/)) _from = "EPSG:" + _from;
  if (typeof _to === "number" || _to.match(/^\d+$/)) _to = "EPSG:" + _to;
  return reprojectGeoJSONPluggable(data, {
    in_place,
    reproject: proj4(_from, _to).forward
  });
}

if (typeof define === "function" && define.amd)
  define(function () {
    return reprojectGeoJSON;
  });
if (typeof module === "object") module.exports = reprojectGeoJSON;
if (typeof window === "object") window.reprojectGeoJSON = reprojectGeoJSON;
if (typeof self === "object") self.reprojectGeoJSON = reprojectGeoJSON;
