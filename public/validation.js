function validateForm() {
    // Obține valoarea câmpurilor
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const lastName = document.getElementById("last_name").value;
    const firstName = document.getElementById("first_name").value;
    const displayName = document.getElementById("display_name").value;
    const websiteUrl = document.getElementById("website_url").value;

    // Validare individuală pentru fiecare câmp
    if (!validateUsername(username)) {
        alert("Numele de utilizator este invalid. Acesta trebuie să aibă între 10 și 40 de caractere și poate conține doar litere, cifre, underscore și cratimă.");
        return false;
    }
    if (!validateEmail(email)) {
        alert("Emailul este invalid. Introduceți un email valid.");
        return false;
    }
    if (!validatePassword(password)) {
        alert("Parola este invalidă. Aceasta trebuie să conțină între 8 și 20 de caractere, o literă mare, o literă mică și un număr.");
        return false;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
        alert("Parola de confirmare nu corespunde cu parola sau nu respectă criteriile de validare.");
        return false;
    }
    if (!validateFirstName(firstName)) {
        alert("Prenumele este invalid. Introduceți un prenume valid folosind doar litere.");
        return false;
    }
    if (!validateLastName(lastName)) {
        alert("Numele este invalid. Introduceți un nume valid folosind doar litere.");
        return false;
    }
    if (!validateDisplayName(displayName)) {
        alert("Numele afișat este invalid. Acesta trebuie să aibă între 5 și 30 de caractere și poate conține doar litere, cifre, underscore și cratimă.");
        return false;
    }
    if (!validateWebsiteUrl(websiteUrl)) {
        alert("URL-ul site-ului este invalid. Introduceți un URL valid care începe cu http:// sau https://");
        return false;
    }

    // Dacă toate validările sunt trecute
    return true;
}


// Validare nume utilizator
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{10,40}$/;
    return usernameRegex.test(username);
}

// Validare email
function validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,30}$/;
    return emailRegex.test(email);
}

// Validare parolă
function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return passwordRegex.test(password);
}

// Validare confirmare parolă (parola introdusă trebuie să coincidă cu confirmarea parolei)
function validateConfirmPassword(password, confirmPassword) {
    const confirmPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return confirmPasswordRegex.test(confirmPassword) && password === confirmPassword;
}

// Validare prenume
function validateFirstName(firstName) {
    const firstNameRegex = /^[a-zA-ZăîâșțĂÎÂȘȚ]+$/;
    return firstNameRegex.test(firstName);
}

// Validare nume
function validateLastName(lastName) {
    const lastNameRegex = /^[a-zA-ZăîâșțĂÎÂȘȚ]+$/;
    return lastNameRegex.test(lastName);
}

// Validare nume afișat
function validateDisplayName(displayName) {
    const displayNameRegex = /^[a-zA-Z0-9_-]{5,30}$/;
    return displayNameRegex.test(displayName);
}

// Validare URL website
function validateWebsiteUrl(websiteUrl) {
    const websiteUrlRegex = /^https?:\/\/.+/;
    return websiteUrlRegex.test(websiteUrl);
}
