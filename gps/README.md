# gps

All raw and processed GPS tracks, as well as functions for processing them.

## File Format

The final, processed files are located in their respective `processed` folder, named `[date]-final.geojson`. These are `FeatureCollections` of `LineStrings` representing a route: a path leaving and returning to the restaurant. Each `LineString` contains the following properties (in addition to the standard `GeoJSON` geometry array):

- `time` - Array of UNIX timestamps that correspond with the coordinate of the same index
- `length` - Length (in miles) of the route
- `start` & `end` - Humanized times
- `duration` - Humanized duration
- `stops` - Array of UNIX timestamps that we've determined the delivery person was stopped and delivering the food

## Files

- `routes.js` - Splits a given GPX track into several routes based on entry and exit of a defined "home zone". This determines when to split based on whether the delivery person has been in the "home zone" for 5 consecutive coordinate recordings.
- `convert.js` - Converts, processes, and combines GPX tracks into one GeoJSON `FeatureCollection`. Using `process.js`, we calculate all the properties used in final file. Additionally, we generate potential indications that a delivery is being made. Using these, we can run through the routes and visually confirm when a delivery is being made. These delivery times are stored in the `stops.json` file (this file is the only part that's not generated automatically, but further work could be done to do so).
- `combine.js` - Combines all GeoJSON files into one `FeatureCollection`
- `finalize.js` - Adds stop times and remove unused fields from final GeoJSON

### How To Run

You can recreate the final files using `runner.js`. Each of the shifts is defined in the `runs` variable with information necessary to pass to the files used to split, process, and combine the files. Most notably is the `zoneBoundingBox` variable, with contains the coordinates used to determine whether the delivery person is at the restaurant or not.

Ensure you have the at least Node.js 8 LTS installed on your system. With your command line in this directory, you can edit `runner.js` accordingly to run through any of the routes (`20180113`, `20180204`, or `20180214`), at any of the steps described in the previous section. For example, if you want to rerun `routes.js`, uncomment out line 66 and comment lines 67-69 and run `node runner`. 
