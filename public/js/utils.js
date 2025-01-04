// utils.js

const logger = require('logger');

// async function sendRequest() {
//     alert("Bazinga!!!  you called letMeCallYou")
//     try {
//         logger.info(`sendRequest(): fetch: http://localhost:5000/api/data`);
//         const response = await fetch('http://localhost:5000/api/data', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ message: 'Attack request from Node.js' })
//         });

//         const data = await response.text();
//         logger.info(`sendRequest(): Response from Python server: ${data}`);
//     } catch (error) {
//         logger.error(`sendRequest(): Error sending request: ${error}`);
//     };
// };
// document.getElementById("triggerButton").addEventListener("click", () => {
//     fetch("http://127.0.0.1:5000/api/data", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ message: "Triggered attack" })
//     })
//     .then(response => response.text())
//     .then(data => console.log("Server response:", data))
//     .catch(error => console.error("Error:", error));
// });

document.getElementById('attackButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'This is an attack request' })
        });

        if (response.ok) {
            alert('Request sent successfully!');
        } else {
            alert('Request failed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
