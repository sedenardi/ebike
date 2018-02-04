/* global L */

// import route from '../../../gps/raw/20180111/20180111-filtered.geojson';
import route from '../../../gps/processed/20180113/20180113-final.geojson';
import playback from './playback';

const init = (map) => {
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
			  geojson.resetStyle(l);
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

  const geojson = L.geoJSON(route, {
    style: function () {
      return {
        weight: 4,
        opacity: .6,
        color: 'blue'
      };
    },
    onEachFeature: onEachFeature
  }).addTo(map);

  playback.init(map, route);
};

export default {
  init
};
