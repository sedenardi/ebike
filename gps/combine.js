const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);


module.exports = async (opts) => {
  let files = await readdirAsync(opts.outDir);
  files = files.filter((f) => { return f.indexOf('geojson') !== -1; });
  const actions = files.map(async (f) => {
    return readFileAsync(path.join(opts.outDir, f));
  });
  const res = await Promise.all(actions);
  const all = res.map((r) => JSON.parse(r.toString()));
  const newFeature = {
    type: 'FeatureCollection',
    features: all.map((fc) => fc.features[0])
  };
  const newFileName = opts.date + '-combined.geojson';
  const newFile = path.join(opts.outDir, newFileName);
  await writeFileAsync(newFile, JSON.stringify(newFeature, null, 2));
};
