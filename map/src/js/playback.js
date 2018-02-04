/* global L */

import 'LeafletPlayback/dist/LeafletPlayback';


L.Control.Stop = L.Control.extend({
  options: {
    position: 'bottomleft'
  },
  initialize: function (stop) {
    L.Util.setOptions(this, stop);
  },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';
    container.style.width = '120px';
    container.style.height = '50px';
    container.innerHTML = '<h3>&nbsp;&nbsp;Delivering...</h3>';
    return container;
  }
});

const init = (map, geojson) => {
  let allStops = [];
  geojson.features.forEach((f) => {
    const fStops = f.properties.stops.map((s, i) => {
      s.num = i + 1;
      s.total = f.properties.stops.length;
      return s;
    });
    allStops = allStops.concat(fStops);
  });

  const findStop = (timestamp) => {
    let stop;
    for (let i = 0; i < allStops.length; i++) {
      if (timestamp >= allStops[i].start && timestamp <= allStops[i].end) {
        stop = allStops[i];
        break;
      }
    }
    return stop;
  };

  let currentStop;
  let stopControl;
  const onPlaybackTimeChange = (timestamp) => {
    const stop = findStop(timestamp);
    if (currentStop !== stop) {
      currentStop = stop;
      if (currentStop) {
        console.log('stopping');
        stopControl = new L.Control.Stop();
        stopControl.addTo(map);
      } else {
        console.log('leaving');
        stopControl.remove();
      }
    }
  };

  const playback = new L.Playback(map, geojson, onPlaybackTimeChange, {
    playControl: true,
    dateControl: true,
    sliderControl: true,
    fadeMarkersWhenStale: true
  });

  return playback;
};

export default {
  init
};
