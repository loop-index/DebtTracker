import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import * as FS from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js';
// https://firebase.google.com/docs/web/setup#available-libraries

const domain = '';

const config = {
    domain: domain,
    img_dir: domain + '/assets/img/',
    style_dir: domain + '/assets/css/',
    js_dir: domain + '/assets/js/',
    audio_dir: domain + '/assets/audio/',
    upload_dir: domain + '/assets/uploads/',
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6xcCWB74Hk-rYf_IhrLp1wSsznagq1bQ",
    authDomain: "debttracker-68158.firebaseapp.com",
    projectId: "debttracker-68158",
    storageBucket: "debttracker-68158.appspot.com",
    messagingSenderId: "504703796874",
    appId: "1:504703796874:web:79de2f240b20004ee44f73",
    measurementId: "G-T4TKGWCQQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// let FB = firebase;
let db = FS.getFirestore(app);
let AU = getAuth(app);
// let STO = firebase.storage();

export { config, FS, AU, db};