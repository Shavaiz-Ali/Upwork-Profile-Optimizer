// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeProfile") {
        handleAnalysis(request.prompts, request.apiKey, sender.tab.id)
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));

        return true; // Keep channel open for async response
    }
});

async function callAnthropic(apiKey, systemPrompt, userPrompt) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 3000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// Extract JSON block if LLM adds any surrounding text
function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not find JSON in response");
    return JSON.parse(match[0]);
}

async function handleAnalysis(prompts, apiKey, tabId) {
    const notify = (msg) => {
        chrome.tabs.sendMessage(tabId, { action: "updateProgress", message: msg }).catch(() => { });
    };

    const systemPrompt = "You are an expert Upwork profile optimizer. Return ONLY valid JSON data as requested.";

    try {
        notify("Step 1/4: Analyzing overall profile and generating score...");
        const scoreRes = await callAnthropic(apiKey, systemPrompt, prompts.scoring);
        const scoreData = extractJSON(scoreRes);

        notify("Step 2/4: Drafting optimized headline and bio variations...");
        const rewriteRes = await callAnthropic(apiKey, systemPrompt, prompts.rewrite);
        const rewriteData = extractJSON(rewriteRes);

        notify("Step 3/4: Auditing skills and portfolio impact...");
        const skillsRes = await callAnthropic(apiKey, systemPrompt, prompts.skillsAndPortfolio);
        const skillsData = extractJSON(skillsRes);

        notify("Step 4/4: Calculating suggested optimal hourly rate...");
        const rateRes = await callAnthropic(apiKey, systemPrompt, prompts.rate);
        const rateData = extractJSON(rateRes);

        // Merge all structured info together
        notify("Finalizing structured profile suggestions...");
        return {
            ...scoreData,
            ...rewriteData,
            ...skillsData,
            ...rateData
        };

    } catch (err) {
        throw err;
    }
}