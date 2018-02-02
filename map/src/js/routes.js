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

    const highlight = (layer) => {
      layer.setStyle({
        weight: 5
      });
      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }
    };

    const dehighlight = (layer) => {
		  if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
			  geojson.resetStyle(layer);
		  }
    };

    const select = (layer) => {
      let previous;
		  if (selected !== null) {
		    previous = selected;
		  }
      map.fitBounds(layer.getBounds());
      selected = layer;
      if (previous) {
			  dehighlight(previous);
      }
    };

    layer.on({
	    mouseover: function (e) {
	      highlight(e.target);
	    },
	    mouseout: function (e) {
	      dehighlight(e.target);
	    },
      click: function (e) {
			  select(e.target);
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
