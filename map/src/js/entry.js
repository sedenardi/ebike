import 'leaflet';
import mapping from './mapping';
import routes from './routes';
import './modal';

const map = mapping.init();
routes.init(map);
