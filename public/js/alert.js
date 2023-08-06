export function hideAlert() {
    const el = document.querySelector('.alert');
    if(el) {
        el.parentElement.removeChild(el);
    }
}

// type is success or error
export function showALert(type, msg) {
    hideAlert();
    const markup = `<div class="alert alert--${type}">
        ${msg}
    </div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(function() {
        hideAlert();
    }, 5000);
}