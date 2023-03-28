import init from './router.js'
import './firebase.js'

async function start(){
    await init();
}

start();

