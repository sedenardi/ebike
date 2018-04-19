# E-bike Delivery Tracking

## Project Structure

### `gps`

This is where all the raw GPS tracks are stored, as well as all the code involved in processing them (splitting, smoothing, etc.) for final presentation.

### `map`

Interactive presentation of the GPS tracks.

### Standalone Deployment

- Install all dependencies: `NODE_ENV=development npm i`
- Run `gulp` to build and copy files
- Copy the `public` folder contents wherever you'd like. Open up `index.html` in an `iframe` or whatever.

### Embedded Deployment

- Edit `map/src/js/mapping.js` - Change `L.map(#id)` to point to a `<div>` on your existing site
- Run `gulp` like standalone deployment and copy `public` files to your assets directory
- Include `public/js/site.js` on your page, it'll inject the map into the `<div>` specified in `mapping.js`

### Development

- Install all dependencies: `NODE_ENV=development npm i`
- Start the web server & incremental build: `npm run watch`
