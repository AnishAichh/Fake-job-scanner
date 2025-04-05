document.getElementById("scanBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

// Receive response from content.js
chrome.runtime.onMessage.addListener((result) => {
    const status = document.getElementById("status");
    if (result.flagged) {
        status.innerText = `⚠️ Scam detected! Probability: ${result.scam_probability}%`;
        status.style.color = "red";
    } else {
        status.innerText = `✅ Looks safe. Scam Probability: ${result.scam_probability}%`;
        status.style.color = "green";
    }
});
