document.getElementById("scanBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener((data) => {
    const status = document.getElementById("status");
    if (data.flagged) {
        status.innerText = `⚠️ Scam Detected!\nProbability: ${data.scam_probability}%`;
        status.style.color = "red";
    } else {
        status.innerText = `✅ Legit Job\nScam Probability: ${data.scam_probability}%`;
        status.style.color = "green";
    }
});
