import route_0 from '../../../gps/raw/20180111/20180111-filtered.geojson';

const init = (map, L) => {
  let selected = null;
  const onEachFeature = (feature, layer) => {
    const content = `
      <p>
        <h4>Route ${feature.properties.sequence + 1}</h4>
        <b>Start: </b>${feature.properties.start}<br />
        <b>End: </b>${feature.properties.end}<br />
        <b>Duration: </b>${feature.properties.duration}<br />
        <b>Distance: </b>${feature.properties.distance}<br />
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
          weight: 6
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

  const geojson = L.geoJSON(route_0, {
    style: function () {
      return {
        weight: 2,
        opacity: 1,
        color: 'blue'
      };
    },
    onEachFeature: onEachFeature
  }).addTo(map);
};

export default {
  init
};
