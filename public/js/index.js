import "@babel/polyfill";
import {login} from './login';
import { displayMap } from "./leaflet";

// DOM elements
const map = document.getElementById('map');
const form = document.getElementsByClassName('form')[0];

// Form Input values
const email = document.getElementById('email') || null;
const password = document.getElementById('password') || null;


// Delegation
if(map) {
    const locations = JSON.parse(map.dataset.locations);
    displayMap(locations);
}

if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = email.value;
        const passwodValue = password.value;
        login({email: emailValue, password: passwodValue});
    });
}