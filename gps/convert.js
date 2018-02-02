const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const tj = require('@mapbox/togeojson');
const xmldom = require('xmldom');
const turf = require('@turf/turf');

const date = '20180111';
const pathDir = path.join(__dirname, `raw/${date}`);
const fileName = '20180111-0-filtered-86.gpx';
const filePath = path.join(pathDir, fileName);

const getGPXDoc = async () => {
  const file = await readFileAsync(filePath);
  return (new xmldom.DOMParser()).parseFromString(file.toString());
};

const convertAndProcess = (doc) => {
  const converted = tj.gpx(doc);
  const length = turf.length(converted, { units: 'miles' });
  converted.features[0].properties.distance = length;
  return converted;
};

const writeGeoJSON = async (json) => {
  const newFileName = fileName.split('.')[0] + '.geojson';
  const newFile = path.join(pathDir, newFileName);
  await writeFileAsync(newFile, JSON.stringify(json, null, 2));
};

const run = async () => {
  const doc = await getGPXDoc();
  const json = convertAndProcess(doc);
  await writeGeoJSON(json);
};

run().catch(console.log);
