import 'leaflet';
import mapping from './mapping';
import routes from './routes';

const map = mapping.init();
routes.init(map);
