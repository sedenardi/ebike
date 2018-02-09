/* global L */

const mapCenters = {
  20180113: [
    40.732529,
    -73.987330
  ],
  20180204: [
    40.777606,
    -73.978637
  ]
};

const tiles = {
  OpenStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  },
  StamenToner: {
    url: '//stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    maxZoom: 19
  }
};

const init = () => {
  const map = L.map('map', {
    center: mapCenters[20180204],
    zoom: 14,
    // preferCanvas: true
  });
  const tile = tiles.StamenToner;
  L.tileLayer(tile.url, {
    attribution: tile.attribution,
    maxZoom: tile.maxZoom
  }).addTo(map);
  return map;
};

export default {
  init
};
