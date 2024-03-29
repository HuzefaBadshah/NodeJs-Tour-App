import { login, logout } from './login';
import { displayMap } from "./leaflet";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

// DOM elements
const map = document.getElementById('map');
const form = document.getElementsByClassName('form--login')[0];
const userDataForm = document.getElementsByClassName('form-user-data')[0];
const userPasswordForm = document.getElementsByClassName('form-user-password')[0];
const logoutBtn = document.getElementsByClassName('nav__el nav__el--logout')[0];
const bookBtn = document.getElementById('book-tour');

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

        // To programatically recreate multipart form-data we need to handle it like this:
        const form = new FormData();
        form.append('name', nameValue);
        form.append('email', emailValue);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log('form multipart: ', form);
        updateSettings(form, 'data');
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

if(logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if(bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;
        bookTour(tourId, e.target);
    })
}