import route_0_0 from './20180111-0-filtered-86.geojson';

const init = (map, L) => {
  L.geoJSON(route_0_0).addTo(map);
};

export default {
  init
};
