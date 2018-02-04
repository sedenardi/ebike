const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const turf = require('@turf/turf');
const moment = require('moment-timezone');

const getFile = async (filePath) => {
  const file = await readFileAsync(filePath);
  return JSON.parse(file.toString());
};

const writeFile = async (doc, newFile) => {
  await writeFileAsync(newFile, JSON.stringify(doc, null, 2));
};

const processLength = (doc) => {
  const length = turf.length(doc, { units: 'miles' });
  doc.features[0].properties.length = length.toFixed(2) + ' mi';
};

const processStartAndEnd = (doc) => {
  const start = moment.tz(doc.features[0].properties.coordTimes[0], 'America/New_York');
  doc.features[0].properties.start = start.format('LT');
  const end = moment.tz(doc.features[0].properties.coordTimes[doc.features[0].properties.coordTimes.length - 1], 'America/New_York');
  doc.features[0].properties.end = end.tz('America/New_York').format('LT');
  doc.features[0].properties.duration = moment.duration(end - start).minutes() + ' minutes';
};

const processTimes = (doc) => {
  doc.features[0].properties.time = doc.features[0].properties.coordTimes.map((t) => {
    return moment(t).valueOf();
  });
};

const processDistances = (doc) => {
  const start = doc.features[0].properties.time[0];
  const TIME_THRESHOLD = 45 * 1000;
  doc.features[0].properties.steps = doc.features[0].geometry.coordinates.map((c, i, arr) => {
    // start of track
    if ((doc.features[0].properties.time[i] - start) < TIME_THRESHOLD) {
      return null;
    }
    // find last index of just over TIME_THRESHOLD
    let idx;
    for (idx = i; idx >= 0; idx--) {
      if ((doc.features[0].properties.time[i] - doc.features[0].properties.time[idx]) >= TIME_THRESHOLD) {
        break;
      }
    }
    return turf.distance(arr[i], arr[idx], { units: 'miles' });
  });
};

const processStops = (doc) => {
  const STEP_THRESHOLD = 0.05;
  doc.features[0].properties.stops = doc.features[0].properties.steps.map((s, i) => {
    const time = doc.features[0].properties.time[i];
    return `${i} - ${(!!s && s < STEP_THRESHOLD).toString()} - ${time}`;
  });
};

const processDoc = module.exports = (doc) => {
  processLength(doc);
  processStartAndEnd(doc);
  processTimes(doc);
  processDistances(doc);
  processStops(doc);
};

const run = async (pathDir, fileName) => {
  const filePath = path.join(pathDir, fileName);
  const doc = await getFile(filePath);
  processDoc(doc);
  const newFileName = fileName.split('.')[0] + '-processed.geojson';
  const newFile = path.join(pathDir, newFileName);
  await writeFile(doc, newFile);
};

const date = '20180111';
const pathDir = path.join(__dirname, `raw/${date}`);
run(pathDir, '20180111-0-filtered-86.geojson').catch(console.log);
