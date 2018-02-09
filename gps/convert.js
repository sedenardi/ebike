const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
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

const run = async (pathDir, fileName, outDir) => {
  const filePath = path.join(pathDir, fileName);
  const gpx = await getGPXDoc(filePath);
  const doc = convert(gpx);
  processDoc(doc);
  const newFileName = fileName.split('.')[0] + '.geojson';
  const newFile = path.join(outDir, newFileName);
  return await writeGeoJSON(doc, newFile);
};

module.exports = async (opts) => {
  let files = await readdirAsync(opts.pathDir);
  files = files.filter((f) => {
    return opts.filePath.indexOf(f) === -1 && f.indexOf('.gpx') > -1;
  });
  const actions = files.map(async (f) => {
    return run(opts.pathDir, f, opts.outDir);
  });
  await Promise.all(actions);
};
