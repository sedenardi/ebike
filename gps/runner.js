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
  },
  20180119: {
    zoneBoundingBox: {
      minLat: new Decimal('40.756488'),
      minLon: new Decimal('-73.970316'),
      maxLat: new Decimal('40.757410'),
      maxLon: new Decimal('-73.968723')
    },
    date: 20180119,
    pathDir: path.resolve(__dirname, './raw/20180119/'),
    filePath: path.resolve(__dirname, './raw/20180119/combined.gpx'),
    outDir: path.join(__dirname, 'processed/20180119/')
  },
  20180204: {
    zoneBoundingBox: {
      minLat: new Decimal('40.777606'),
      minLon: new Decimal('-73.978637'),
      maxLat: new Decimal('40.778585'),
      maxLon: new Decimal('-73.977929')
    },
    date: 20180204,
    pathDir: path.resolve(__dirname, './raw/20180204/'),
    filePath: path.resolve(__dirname, './raw/20180204/combined.gpx'),
    outDir: path.join(__dirname, 'processed/20180204/')
  },
  20180214: {
    zoneBoundingBox: {
      minLat: new Decimal('40.767795'),
      minLon: new Decimal('-73.959158'),
      maxLat: new Decimal('40.768608'),
      maxLon: new Decimal('-73.958557')
    },
    date: 20180214,
    pathDir: path.resolve(__dirname, './raw/20180214/'),
    filePath: path.resolve(__dirname, './raw/20180214/combined.gpx'),
    outDir: path.join(__dirname, 'processed/20180214/')
  }
};

const run = runs[20180214];

// routes(run).catch(console.log);
// convert(run).catch(console.log);
// combine(run).catch(console.log);
finalize(run).catch(console.log);

/*
40.768608, -73.958557
40.767795, -73.959158
*/
