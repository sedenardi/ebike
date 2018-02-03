const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const tj = require('@mapbox/togeojson');
const xmldom = require('xmldom');
const processDoc = require('./process');

const getGPXDoc = async (filePath) => {
  const file = await readFileAsync(filePath);
  return (new xmldom.DOMParser()).parseFromString(file.toString());
};

const convert = (doc) => {
  const converted = tj.gpx(doc);
  return converted;
};

const writeGeoJSON = async (json, newFile) => {
  await writeFileAsync(newFile, JSON.stringify(json, null, 2));
  return json;
};

const run = async (pathDir, fileName) => {
  const filePath = path.join(pathDir, fileName);
  const gpx = await getGPXDoc(filePath);
  const doc = convert(gpx);
  processDoc(doc);
  const newFileName = fileName.split('.')[0] + '.geojson';
  const newFile = path.join(pathDir, newFileName);
  return await writeGeoJSON(doc, newFile);
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
