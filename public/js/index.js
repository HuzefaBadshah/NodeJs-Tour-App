import "@babel/polyfill";
import { login, logout } from './login';
import { displayMap } from "./leaflet";
import { updateSettings } from "./updateSettings";

// DOM elements
const map = document.getElementById('map');
const form = document.getElementsByClassName('form--login')[0];
const userDataForm = document.getElementsByClassName('form-user-data')[0];
const userPasswordForm = document.getElementsByClassName('form-user-password')[0];
const logoutBtn = document.getElementsByClassName('nav__el nav__el--logout')[0];

// Form Input values
const email = document.getElementById('email') || null;
const password = document.getElementById('password') || null;
const name = document.getElementById('name') || null;


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

if(userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = email.value;
        const nameValue = name.value;
        updateSettings({name: nameValue, email: emailValue}, 'data');
    });
}

if(userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementsByClassName('btn--save-password')[0].textContent = 'Updating Password';
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
        await updateSettings({currentPassword, password, passwordConfirm}, 'password');
        document.getElementsByClassName('btn--save-password')[0].textContent = 'Save password';
    });
}

if(logout) {
    logoutBtn.addEventListener('click', logout);
}