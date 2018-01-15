const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const xml2js = require('xml2js');
const parseStringAsync = promisify(xml2js.parseString);
const Decimal = require('decimal.js');

const filePath = path.join(__dirname, 'raw/20180111/activity_2430523815.gpx');

const zoneBoundingBox = {
  minLat: new Decimal('40.732529'),
  minLon: new Decimal('-73.987330'),
  maxLat: new Decimal('40.733214'),
  maxLon: new Decimal('-73.986225')
};

const getGPX = async () => {
  const file = await readFileAsync(filePath);
  return await parseStringAsync(file);
};

const parseToCoordinateArray = (gpx) => {
  const points = gpx.trk[0].trkseg[0].trkpt;
  return points.map((p, i) => {
    const ptObj = {
      id: i,
      lat: p['$'].lat,
      lon: p['$'].lon,
      ele: p.ele[0],
      time: p.time[0]
    };
    const lat = new Decimal(ptObj.lat);
    const lon = new Decimal(ptObj.lon);
    ptObj.inZone = lat.lt(zoneBoundingBox.maxLat) && lat.gt(zoneBoundingBox.minLat) &&
      lon.lt(zoneBoundingBox.maxLon) && lon.gt(zoneBoundingBox.minLon);
    return ptObj;
  });
};

const nextValuesSame = (array, index, val) => {
  const lookAhead = Math.min(array.length - index, 5);
  let sameValues = true;
  for (let i = 0; i < lookAhead; i++) {
    sameValues = sameValues && (array[index + i].inZone === val);
  }
  return sameValues;
};

const getRoutes = (coords) => {
  const routes = [];
  let onRoute = false;
  coords.forEach((c, i) => {
    if (!onRoute) {
      if (!c.inZone && nextValuesSame(coords, i, false)) {
        const newRoute = [c];
        routes.push(newRoute);
        onRoute = true;
      }
    } else {
      if (c.inZone && nextValuesSame(coords, i, true)) {
        onRoute = false;
      } else {
        routes[routes.length - 1].push(c);
      }
    }
  });
  return routes;
};

const run = async () => {
  const gpx = await getGPX();
  const coords = parseToCoordinateArray(gpx.gpx);
  const routes = getRoutes(coords);
  console.log(coords);
};

run().catch(console.log);

/*
lat: "40.73294014669954776763916015625"
lon: "-73.9871017076075077056884765625"
*/
// 40.733214, -73.987330
// 40.732529, -73.986225
