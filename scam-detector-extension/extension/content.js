const getText = (selector) => {
    const el = document.querySelector(selector);
    return el && el instanceof HTMLElement ? el.innerText : "";
};

// Extract job ID from the URL
const jobId = window.location.pathname.split("/").pop();

const jobData = {
    id: jobId,
    title: getText(".job-title"),
    company: getText(".job-company"),
    location: getText(".job-location"),
    description: getText(".job-description"),
    url: window.location.href
};

console.log("Extracted job data with ID:", jobData);

fetch("http://localhost:3000/api/add-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData)
})
    .then((res) => res.json())
    .then((data) => {
        alert(`⚠️ Scam Probability: ${data.scam_probability}%\nStatus: ${data.flagged ? "Scam" : "Safe"}`);
        chrome.runtime.sendMessage(data);
    })
    .catch((err) => console.error("Error posting job data:", err));
