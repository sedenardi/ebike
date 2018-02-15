/* global L */

import route0 from '../../../gps/processed/20180113/20180113-final.geojson';
import route2 from '../../../gps/processed/20180204/20180204-final.geojson';
import playback from './playback';

L.Control.Shifts = L.Control.extend({
  options: {
    position: 'bottomleft'
  },
  initialize: function (opts) {
    this.opts = opts;
  },
  onAdd: function () {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.style.backgroundColor = 'white';
    container.style.padding = '1em';

    const select = L.DomUtil.create('select', null, container);
    const option1 = new Option('01/13 - Red House (EV)', '20180113', true);
    select.appendChild(option1);
    const option2 = new Option('01/13 - Tenzen (UWS)', '20180204', true);
    select.appendChild(option2);

    select.onchange = (event) => { this.opts.handler(event.target.value); };

    return container;
  }
});

const init = (map) => {
  const routes = {
    20180113: {
      route: route0,
      center: [40.732529, -73.987330]
    },
    20180204: {
      route: route2,
      center: [40.777606, -73.978637]
    }
  };

  const shiftSelect = new L.Control.Shifts({
    handler: (value) => {
      useRoute(routes[value]);
    }
  });
  shiftSelect.addTo(map);

  let selected = null;
  const onEachFeature = (feature, layer) => {
    const content = `
      <p>
        <h4>${feature.properties.stops.length} Deliveries</h4>
        <b>Start: </b>${feature.properties.start}<br />
        <b>End: </b>${feature.properties.end}<br />
        <b>Duration: </b>${feature.properties.duration}<br />
        <b>Distance: </b>${feature.properties.length}<br />
        <b>Deliveries: </b>
      </p>
    `;

    layer.bindPopup(content);

    const dehighlight = (l) => {
		  if (selected === null || selected._leaflet_id !== l._leaflet_id) {
			  currentGeoJson.resetStyle(l);
		  }
    };

    layer.on({
	    mouseover: function (e) {
        e.target.setStyle({
          weight: 6,
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          e.target.bringToFront();
        }
	    },
	    mouseout: function (e) {
	      dehighlight(e.target);
	    },
      click: function (e) {
        if (!selected) {
          map.fitBounds(e.target.getBounds());
          selected = e.target;
        } else if (selected._leaflet_id !== e.target._leaflet_id) {
          const prev = selected;
          selected = e.target;
          dehighlight(prev);
        }
      }
    });
  };

  let currentPlayback = null;
  let currentGeoJson = null;
  const useRoute = (route) => {
    if (currentPlayback) {
      currentPlayback.destroy();
    }
    currentPlayback = playback.init(map, route.route);

    if (currentGeoJson) {
      currentGeoJson.remove();
    }
    currentGeoJson = L.geoJSON(route.route, {
      style: function () {
        return {
          weight: 4,
          opacity: .6,
          color: 'blue'
        };
      },
      onEachFeature: onEachFeature
    });//.addTo(map);

    map.setView(route.center, 14);
  };

  useRoute(routes[20180113]);
};

export default {
  init
};
