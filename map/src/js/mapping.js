const mapCenter = [
  40.732529,
  -73.987330
];

const tiles = {
  OpenStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }
};

const init = (L) => {
  const map = L.map('map').setView(mapCenter, 14);

  L.tileLayer(tiles.OpenStreetMap.url, {
    attribution: tiles.OpenStreetMap.attribution,
    maxZoom: tiles.OpenStreetMap.maxZoom,
  }).addTo(map);
  return map;
};

export default {
  init
};
