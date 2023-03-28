// import { loadMyView } from "/screens/mine.js";
import { loadMainView, loadLoginView, loadSignupView } from "/screens/default.js";
import { loadNav } from "/screens/sidenav.js";
import { App } from "/screens/app.js";

export default async function init(){
    const appPanel = $('#content');
    
    // Initial Navigo
    var root = '/';
    var useHash = true; // Defaults to: false
    var hash = '#'; // Defaults to: '#'
    window.router = new Navigo(root, useHash, hash);
    
    //Initialize app
    const app = new App();
    
    var outgoingScreen;
    var incomingScreen;
    
    // Wait for app to initialize
    app.init(setupRoutes);

    // Set up routes
    function setupRoutes() {
        window.router.on({
            '/': () => {
                router.navigate('/outgoing');
            },
            '/outgoing': async () => {
                loadNav();
                console.log('Now on first page');
                outgoingScreen = await app.getOutgoingScreen();
                await outgoingScreen.render();
                // loadMyView();
            },
            '/incoming': async () => {
                loadNav();
                console.log('Now on second page');
                incomingScreen = await app.getIncomingScreen();
                await incomingScreen.render();
            },
            '/index.html': () => {
                router.navigate('/');
            }
        }).resolve();
        
        window.router.notFound((query) => {
            appPanel.innerHTML = '404 - Page not found';
        });
    }

    window.router.on({
        '/login': () => {
            loadLoginView();
        },
        '/signup': () => {
            loadSignupView();
        },
    });

}