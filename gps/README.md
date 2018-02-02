# gps

All raw and processed GPS tracks, as well as functions for processing them.

## Functions

- `routes.js` - Splits a given GPX track into several routes based on entry and exit of a defined "home zone" (hardcoded for now)

## TODO

- Scripted route smoothing based on `gpsbabel` (base simplify count on original number of track points)
- Interactive "home zone" setting
- Calculate instantaneous velocity (over several trackpoints), compensate for first/last point outside of "home zone"
- Output formatted GeoJSON for presentation
