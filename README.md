:warning: __warning__. _Use with caution.  In most cases, you don't want to do this.  Technically, you can't reproject a GeoJSON, 
because the GeoJSON standard only accepts 1 projection (Latitude/Longitude on a WGS 1984 Datum)._

# reproject-geojson
> Reproject GeoJSON

# features
- Works Offline
- Pure JavaScript
- Cross-Platform (NodeJS or Browser)

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
    "coordinates": [13981728.04363516, 1130195.3976388907]
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
```

# advanced usage
If you want the convenience of reproject-geojson without the overhead of the 
[proj4-fully-loaded](https://github.com/danieljdufour/proj4-fully-loaded) dependency,
you can use the pluggable version of reprojectGeoJSON:
```js
import reprojectGeoJSONPlugable from "reproject-geojson/pluggable.js";

const proj4 = require("proj4");

const reproject = proj4("EPSG:3857", "EPSG:4326").forward;
reprojectGeoJSONPlugable(geojson, { reproject });
```

# references
- https://geojson.org/
- https://datatracker.ietf.org/doc/html/rfc7946
