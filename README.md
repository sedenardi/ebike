# E-bike Delivery Tracking

## Project Structure

### `gps`

This is where all the raw GPS tracks are stored, as well as all the code involved in processing them (splitting, smoothing, etc.) for final presentation.

### `map`

Interactive presentation of the GPS tracks.

To run locally:

- Install all dependencies: `NODE_ENV=development npm i`
- Start the web server & incremental build: `npm run watch`
