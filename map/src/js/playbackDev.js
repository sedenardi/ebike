/* global L */

import 'LeafletPlayback/dist/LeafletPlayback';

const init = (map, geojson) => {
  const onPlaybackTimeChange = (timestamp, trackIndices) => {
    console.log(trackIndices);
  };

  const playback = new L.Playback(map, geojson, onPlaybackTimeChange, {
    tickLen: 6000,
    speed: .125,
    tracksLayer: false,
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
