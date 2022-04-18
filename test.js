const fs = require("fs");
const test = require("flug");
const proj4 = require("proj4-fully-loaded");

const reprojectGeoJSON = require("./reproject-geojson.js");
const reprojectGeoJSONPluggable = require("./pluggable.js");

const original = JSON.parse(fs.readFileSync("./data/sri-lanka.geojson", "utf-8"));

// example from geojson.org
const dinagat = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [125.6, 10.1]
  },
  properties: {
    name: "Dinagat Islands"
  }
};

const dinagat_3857 = { type: "Feature", geometry: { type: "Point", coordinates: [13981728.04363516, 1130195.3976388907] }, properties: { name: "Dinagat Islands" } };

test("reproject Sri Lanka", ({ eq }) => {
  const reprojected = reprojectGeoJSON(original, { to: "EPSG:3857" });
  eq(original.features.length, reprojected.features.length);
  eq(original.features[0].properties, reprojected.features[0].properties);
  eq(original.features[0].geometry.type, reprojected.features[0].geometry.type);
  eq(original.features[0].geometry.coordinates.length, reprojected.features[0].geometry.coordinates.length);
  eq(reprojected.features[0].geometry.coordinates[0].slice(0, 4), [
    [9104593.951004118, 839879.4542797726],
    [9087825.139118828, 723091.922578529],
    [9041148.590358196, 691211.6576356536],
    [8944338.183765557, 665600.7134755934]
  ]);
});

test("reproject Sri Lanka (pluggable)", ({ eq }) => {
  const reprojected = reprojectGeoJSONPluggable(original, {
    reproject: proj4("EPSG:4326", "EPSG:3857").forward
  });
  eq(original.features.length, reprojected.features.length);
  eq(original.features[0].properties, reprojected.features[0].properties);
  eq(original.features[0].geometry.type, reprojected.features[0].geometry.type);
  eq(original.features[0].geometry.coordinates.length, reprojected.features[0].geometry.coordinates.length);
  eq(reprojected.features[0].geometry.coordinates[0].slice(0, 4), [
    [9104593.951004118, 839879.4542797726],
    [9087825.139118828, 723091.922578529],
    [9041148.590358196, 691211.6576356536],
    [8944338.183765557, 665600.7134755934]
  ]);
});

test("reproject using pluggable with epsg code", ({ eq }) => {
  eq(reprojectGeoJSONPluggable(dinagat, { reproject: proj4("EPSG:4326", "EPSG:3857").forward }), dinagat_3857);
});

test("reproject using epsg code", ({ eq }) => {
  eq(reprojectGeoJSON(dinagat, { to: 3857 }), dinagat_3857);
});

test("reproject using epsg name", ({ eq }) => {
  eq(reprojectGeoJSON(dinagat, { to: "EPSG:3857" }), dinagat_3857);
});

test("reproject using proj4 string", ({ eq }) => {
  eq(reprojectGeoJSON(dinagat, { to: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs" }), dinagat_3857);
});

test("reproject coordinate", ({ eq }) => {
  const coord = [125.6, 10.1];
  eq(reprojectGeoJSON(coord, { from: 4326, to: 2857 }), [-10392532.826466985, 9537760.516920967]);
});

test("reproject ring", ({ eq }) => {
  const ring = [
    [9104593.951004118, 839879.4542797726],
    [9087825.139118828, 723091.922578529],
    [9041148.590358196, 691211.6576356536],
    [8944338.183765557, 665600.7134755934],
    [9104593.951004118, 839879.4542797726]
  ];
  eq(reprojectGeoJSON(ring, { from: 3857, to: 4326 }), [
    [81.78795901889141, 7.5230553247331535],
    [81.63732221876059, 6.481775214051915],
    [81.21801964714433, 6.197141424988275],
    [80.34835696810441, 5.968369859232139],
    [81.78795901889141, 7.5230553247331535]
  ]);
});
