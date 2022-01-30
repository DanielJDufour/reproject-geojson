# reproject-geojson
Reproject GeoJSON.  Works Offline.


# install
```bash
npm install reproject-geojson
```

# usage
```js
import reprojectGeoJSON from "reproject-geojson";

const geojson = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
};

// reproject using EPSG Code
reprojectGeoJSON(geojson, { to: 3857 });
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [13981728.04363516,1130195.3976388907]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
};

// reproject using Proj4 String
reprojectGeoJSON(geojson, { to: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 ..." });

// reproject using Well-Known Text
reprojectGeoJSON(geojson, { to: 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984", ...' });

// reproject using ESRI Well-Known Text
reprojectGeoJSON(geojson, { to: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984", ...' });

