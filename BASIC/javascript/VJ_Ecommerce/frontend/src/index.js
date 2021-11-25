import homeScreen from './srcreens/HomeScreen.js';
import ProductScreen from './srcreens/ProductScreen.js';
import Error404Screen from './srcreens/Error404Screen.js';
import { parseRequestUrl } from './utils.js';




const routes = {
    '/': homeScreen,
    '/product/:id' : ProductScreen,
}

const router = async () => {
    const request = parseRequestUrl();
    const main = document.getElementById('main-container');

    const parseUrl = 
        (request.resource ? `/${request.resource}` : '/') +
        (request.id ? `/:id` : '') + 
        (request.verb ? `/${request.verb}` : '');

    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    main.innerHTML = await screen.render();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);