import { loadMyView } from "/screens/mine.js";
import { loadMainView, loadLoginView, loadSignupView } from "/screens/default.js";

const app = $('#content');

// Initial Navigo
var root = '/';
var useHash = true; // Defaults to: false
var hash = '#'; // Defaults to: '#'
window.router = new Navigo(root, useHash, hash);

window.router.on({
    '/': () => {
        loadMyView();
    },
    '/another': () => {
        app.innerHTML = 'Now on second page';
        console.log('Now on second page');
    },
    '/main': () => {
    }, 
    '/login': () => {
        loadLoginView();
    },
    '/signup': () => {
        loadSignupView();
    }
}).resolve();

window.router.notFound((query) => {
    app.innerHTML = '404 - Page not found';
});