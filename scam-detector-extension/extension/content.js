// Helper function to safely get innerText
const getText = (selector) => {
    const el = document.querySelector(selector);
    return el && el instanceof HTMLElement ? el.innerText : "";
};

// Extract job data from the page
const jobData = {
    title: getText(".job-title"),        // e.g., <h1 class="job-title">Frontend Developer</h1>
    company: getText(".company-name"),  // e.g., <div class="company-name">Tech Corp</div>
    location: getText(".job-location"), // e.g., <span class="job-location">Remote</span>
    description: getText(".job-description"), // e.g., <div class="job-description">Responsibilities include...</div>
    url: window.location.href
};

// Debug: Log extracted job data
console.log("Extracted Job Data:", jobData);

// Send it to your backend for scam detection
fetch("http://localhost:3000/api/add-job", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(jobData)
})
    .then(response => response.json())
    .then(data => {
        console.log("Backend Response:", data);
        alert(`Job Scam Score: ${data.scam_probability || "N/A"} | Flagged: ${data.flagged}`);
    })
    .catch(error => {
        console.error("Error sending job data:", error);
    });
