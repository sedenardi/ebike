const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const xml2js = require('xml2js');
const parseStringAsync = promisify(xml2js.parseString);
const Decimal = require('decimal.js');

const getGPX = async (filePath) => {
  const file = await readFileAsync(filePath);
  return await parseStringAsync(file);
};

const parseToCoordinateArray = (gpx, zoneBoundingBox) => {
  const points = gpx.trk[0].trkseg[0].trkpt;
  return points.map((p, i) => {
    const ptObj = {
      id: i,
      lat: p.$.lat,
      lon: p.$.lon,
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

const createGPX = async (originalGPX, route, idx, pathDir, date) => {
  const points = route.map((c) => {
    return {
      $: {
        lat: c.lat,
        lon: c.lon
      },
      ele: [c.ele],
      time: [c.time]
    };
  });
  const newGPX = JSON.parse(JSON.stringify(originalGPX));
  newGPX.gpx.trk[0].trkseg[0].trkpt = points;
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(newGPX);
  idx = idx < 10 ? ('0' + idx) : ('' + idx);
  const newFile = path.join(pathDir, `${date}-${idx}.gpx`);
  await writeFileAsync(newFile, xml);
};

module.exports = async (opts) => {
  const gpx = await getGPX(opts.filePath);
  const coords = parseToCoordinateArray(gpx.gpx, opts.zoneBoundingBox);
  const routes = getRoutes(coords);
  const actions = routes.map(async (r, i) => {
    console.log(`Logging route #${i} with ${r.length} points`);
    await createGPX(gpx, r, i, opts.pathDir, opts.date);
  });
  await Promise.all(actions);
  // console.log(coords);
};
