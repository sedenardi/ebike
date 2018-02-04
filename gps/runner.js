const path = require('path');
// const fs = require('fs');
// const promisify = require('util').promisify;
// const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);
const Decimal = require('decimal.js');

const routes = require('./routes');
const convert = require('./convert');
const combine = require('./combine');
const finalize = require('./finalize');

const runs = {
  20180113: {
    zoneBoundingBox: {
      minLat: new Decimal('40.732529'),
      minLon: new Decimal('-73.987330'),
      maxLat: new Decimal('40.733214'),
      maxLon: new Decimal('-73.986225')
    },
    date: 20180113,
    pathDir: path.resolve(__dirname, './raw/20180113/'),
    filePath: path.resolve(__dirname, './raw/20180113/combined.gpx'),
    outDir: path.join(__dirname, 'processed/20180113/')
  }
};

// routes(runs[20180113]).catch(console.log);
// convert(runs[20180113]).catch(console.log);
// combine(runs[20180113]).catch(console.log);
finalize(runs[20180113]).catch(console.log);
