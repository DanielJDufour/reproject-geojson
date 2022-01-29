const fs = require("fs");
const test = require("flug");
const reprojectGeoJSON = require("./reproject-geojson.js");

const original = JSON.parse(fs.readFileSync("./data/sri-lanka.geojson", "utf-8"));

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
