let map;

const tiles = {
  OpenStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }
};

const init = (L) => {
  map = L.map('map').setView([51.505, -0.09], 13);

  L.tileLayer(tiles.OpenStreetMap.url, {
    attribution: tiles.OpenStreetMap.attribution,
    maxZoom: tiles.OpenStreetMap.maxZoom,
  }).addTo(map);
};

export default {
  init
};
