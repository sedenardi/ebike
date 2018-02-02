const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const tj = require('@mapbox/togeojson');
const xmldom = require('xmldom');
const turf = require('@turf/turf');
const moment = require('moment-timezone');

const getGPXDoc = async (filePath) => {
  const file = await readFileAsync(filePath);
  return (new xmldom.DOMParser()).parseFromString(file.toString());
};

const convertAndProcess = (doc, fileName) => {
  const converted = tj.gpx(doc);
  const length = turf.length(converted, { units: 'miles' });
  converted.features[0].properties.distance = length.toFixed(2) + ' mi';

  const start = moment.tz(converted.features[0].properties.coordTimes[0], 'America/New_York');
  converted.features[0].properties.start = start.format('LT');
  const end = moment.tz(converted.features[0].properties.coordTimes[converted.features[0].properties.coordTimes.length - 1], 'America/New_York');
  converted.features[0].properties.end = end.tz('America/New_York').format('LT');
  converted.features[0].properties.duration = moment.duration(end - start).minutes() + ' minutes';

  const seqNo = fileName.split('-')[1];
  converted.features[0].properties.sequence = parseInt(seqNo);

  return converted;
};

const writeGeoJSON = async (json, newFile) => {
  await writeFileAsync(newFile, JSON.stringify(json, null, 2));
  return json;
};

const run = async (pathDir, fileName) => {
  const filePath = path.join(pathDir, fileName);
  const doc = await getGPXDoc(filePath);
  const json = convertAndProcess(doc, fileName);
  const newFileName = fileName.split('.')[0] + '.geojson';
  const newFile = path.join(pathDir, newFileName);
  return await writeGeoJSON(json, newFile);
};

const runAll = async () => {
  const date = '20180111';
  const pathDir = path.join(__dirname, `raw/${date}`);
  const fileNames = [
    '20180111-0-filtered-86.gpx',
    '20180111-1-filtered-103.gpx',
    '20180111-2-filtered-200.gpx',
    '20180111-3-filtered-315.gpx',
    '20180111-4-filtered-308.gpx',
    '20180111-5-filtered-103.gpx'
  ];
  const actions = fileNames.map(async (f) => {
    return run(pathDir, f);
  });
  const all = await Promise.all(actions);
  const newFeature = {
    type: 'FeatureCollection',
    features: all.map((fc) => fc.features[0])
  };
  const newFileName = fileNames[0].split('-')[0] + '-filtered.geojson';
  const newFile = path.join(pathDir, newFileName);
  await writeGeoJSON(newFeature, newFile);
};

runAll().catch(console.log);
