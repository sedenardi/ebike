import tingle from 'tingle.js';

const modal = new tingle.modal({
  footer: false,
  stickyFooter: false,
  closeMethods: ['overlay', 'escape'],
  cssClass: ['custom-class-1', 'custom-class-2'],
});

const content = `
  <div id="intro-modal">
This is the interactive map created for the Gothamist article "NYC's War On E-Bikes Takes Toll On Immigrant Delivery Workers" by Christopher Robbins and Jeffrey E. Singer.
The data was collected over the course of a month from 3 different locations. I encourage you to read the article below to read about these hardworking people, and the problems they face in NYC.
<br />
<br />
<a href="http://gothamist.com/2018/04/26/e-bike_immigants_nypd_nyc.php" target="_blank">NYC's War On E-Bikes Takes Toll On Immigrant Delivery Workers</a>
<br />
<br />
Full source for the map, as well as the raw GPS data, can be found <a href="https://github.com/sedenardi/ebike" target="_blank">here</a>.
</div>`;

modal.setContent(content);

modal.open();
