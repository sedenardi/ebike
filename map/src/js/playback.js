/* global L */

import 'LeafletPlayback/dist/LeafletPlayback';

const init = (map, geojson) => {
  const onPlaybackTimeChange = (timestamp) => {
    console.log(timestamp);
  };

  const playback = new L.Playback(map, geojson, onPlaybackTimeChange, {
    playControl: true,
    dateControl: true,
    sliderControl: true
  });

  return playback;
};

export default {
  init
};
