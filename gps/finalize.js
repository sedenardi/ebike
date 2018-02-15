const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = async (opts) => {
  const combinedfile = path.join(opts.outDir, `${opts.date}-combined.geojson`);
  const combined = await readFileAsync(combinedfile);
  const doc = JSON.parse(combined);
  const stopsFile = path.join(opts.outDir, 'stops.json');
  const stopsRes = await readFileAsync(stopsFile);
  const stops = JSON.parse(stopsRes);
  doc.features.forEach((f, i) => {
    f.properties.name = undefined;
    f.properties.type = undefined;
    f.properties.coordTimes = undefined;
    f.properties.steps = undefined;
    f.properties.stops = stops[i];
    f.geometry.coordinates = f.geometry.coordinates.map((c) => [c[0], c[1]]);
  });
  const newFileName = opts.date + '-final.geojson';
  const newFile = path.join(opts.outDir, newFileName);
  await writeFileAsync(newFile, JSON.stringify(doc, null, 2));
};
