chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "jobExtracted") {
        console.log("Job data received from content script:", message.data);

        // Send job details to the backend API
        fetch("http://localhost:3000/api/add-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message.data),
        })
            .then(response => response.json())
            .then(data => console.log("Job added successfully:", data))
            .catch(error => console.error("Error sending job data:", error));
    }
});
.3.toExponential





























