import Leaflet from 'leaflet';
import mapping from './mapping';
import routes from './routes';

const map = mapping.init(Leaflet);
routes.init(map, Leaflet);
