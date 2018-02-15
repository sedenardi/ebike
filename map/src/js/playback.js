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
  const showStop = (timestamp) => {
    const stop = findStop(timestamp);
    if (currentStop !== stop) {
      currentStop = stop;
      if (stopControl) {
        console.log('leaving');
        stopControl.remove();
        stopControl = null;
      }
      if (currentStop) {
        console.log('stopping');
        stopControl = new L.Control.Stop();
        stopControl.addTo(map);
      }
    }
  };

  const pathLine = L.polyline([], {
    weight: 4,
    opacity: .6,
    color: 'blue'
  });
  pathLine.addTo(map);
  const drawPath = (trackIndices) => {
    for (let i = 0; i < trackIndices.length; i++) {
      if (trackIndices[i] !== undefined) {
        const points = geojson.features[i].geometry.coordinates.slice(0, trackIndices[i] + 1).map((c) => {
          return L.GeoJSON.coordsToLatLng(c);
        });
        pathLine.setLatLngs(points);
        break;
      }
    }
  };
  global.pathLine = pathLine;

  const onPlaybackTimeChange = (timestamp, trackIndices) => {
    // console.log(trackIndices);
    showStop(timestamp);
    drawPath(trackIndices);
  };

  const icon = L.icon({
    iconUrl: 'css/images/e-bike.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  });

  const playback = new L.Playback(map, geojson, onPlaybackTimeChange, {
    tickLen: 4000,
    speed: .25,
    tracksLayer: false,
    playControl: true,
    dateControl: true,
    sliderControl: true,
    staleTime: 2 * 60 * 1000,
    hideMarkerWhenStale: true,
    marker: () => {
      return {
        icon: icon
      };
    }
  });

  return playback;
};

export default {
  init
};
