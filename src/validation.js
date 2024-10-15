const formContainer = document.getElementById('form-container');
formContainer.addEventListener('submit', function(event) {
    // get the documents
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const displayName = document.getElementById('displayName').value;
    const websiteUrl = document.getElementById('websiteUrl').value;

    // regex
    const usernameRegex = /^[a-zA-Z0-9_-]{10,40}$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,30}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    const confirmPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    const lastNameRegex = /^[a-zA-ZăîâșțĂÎÂȘȚ]+/;
    const firstNameRegex = /^[a-zA-ZăîâșțĂÎÂȘȚ]+/;
    const displayNameRegex = /^[a-zA-Z0-9_-]{5,30}/;
    const websiteUrlRegex = /^https?:\/\/.+/;

    // validation
    if (!usernameRegex.test(username)) {
        alert('Bad username');
        event.preventDefault();
        return;
    };
    if (!emailRegex.test(email)) {
        alert('Bad email');
        event.preventDefault();
        return;
    };
    if (!passwordRegex.test(password)) {
        alert('Bad password');
        event.preventDefault();
        return;
    };
    if (!confirmPasswordRegex.test(confirmPassword)) {
        alert('Bad password');
        event.preventDefault();
        return;
    };

    if (password !== confirmPassword) {
        alert('Parolele nu se potrivesc!');
        event.preventDefault();
        return;
    }


    if (!lastNameRegex.test(lastName)) {
        alert('Bad lastName');
        event.preventDefault();
        return;
    };
    if (!firstNameRegex.test(firstName)) {
        alert('Bad firstName');
        event.preventDefault();
        return;
    };
    if (!displayNameRegex.test(displayName)) {
        alert('Bad displayName');
        event.preventDefault();
        return;
    };
    if (!websiteUrlRegex.test(websiteUrl)) {
        alert('Bad websiteUrl');
        event.preventDefault();
        return;
    };
});