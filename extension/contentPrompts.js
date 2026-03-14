// contentPrompts.js

window.UPO_Prompts = {
    getMultiStepPrompts: (profileData) => {
        const base = `
Name: ${profileData.name || "N/A"}
Headline: ${profileData.title || "N/A"}
Overview: ${profileData.overview || "N/A"}
Skills: ${(profileData.skills || []).join(', ') || "N/A"}
Portfolio: ${(profileData.portfolioDescriptions || []).join('; ') || "N/A"}
Current Rate: ${profileData.hourlyRate || "N/A"}
Job Success: ${profileData.jobSuccess || "N/A"}
`;
        return {
            scoring: `
Analyze this Upwork profile:
${base}

Return ONLY a perfectly formatted JSON object evaluating overall quality. Do not wrap in markdown tags like \`\`\`json.
{
  "overallScore": <number 0-100>,
  "grade": "<Poor|Fair|Good|Excellent>",
  "potentialEarningsIncrease": "<estimate e.g. '$1k+/mo'>",
  "scoreBreakdown": { "headline": <0-25>, "bio": <0-25>, "skills": <0-20>, "portfolio": <0-20>, "rate": <0-10> },
  "topImprovements": [
    { "priority": 1, "category": "<Category>", "action": "<brief action>", "impact": "<high|medium|low>", "effort": "<high|medium|low>" }
  ],
  "competitorComparison": "<string comparison vs top freelancers>"
}
`,
            rewrite: `
Analyze this Upwork profile:
${base}

Return ONLY a perfectly formatted JSON object with rewrites for the headline and bio. Target audience: clients looking for a specific skill. Tone: professional & concise. Do not wrap in markdown tags like \`\`\`json.
{
  "headline": {
    "score": <0-100>, "issues": ["<issue>"], "rewrite": "<Optimized max 70 chars>", "tips": ["<tip>"]
  },
  "bio": {
    "score": <0-100>, "issues": ["<issue>"], "rewrite": "<Optimized 2-3 paragraphs focusing on client value>", "tips": ["<tip>"]
  }
}
`,
            skillsAndPortfolio: `
Analyze this Upwork profile:
${base}

Return ONLY a perfectly formatted JSON object evaluating skills and portfolio. Do not wrap in markdown tags like \`\`\`json.
{
  "skills": {
    "score": <0-100>, "currentCount": ${(profileData.skills || []).length},
    "missing": ["<skill>"], "redundant": ["<skill>"], "tips": ["<tip>"]
  },
  "portfolio": {
    "score": <0-100>, "issues": ["<issue>"], "tips": ["<tip>"]
  }
}
`,
            rate: `
Analyze this Upwork profile:
${base}

Return ONLY a perfectly formatted JSON object calculating suggested hourly rate based on skills, portfolio, and Upwork averages. Do not wrap in markdown tags like \`\`\`json.
{
  "rate": {
    "score": <0-100>, "currentRate": "${profileData.hourlyRate || "N/A"}",
    "suggestedMin": <number>, "suggestedMax": <number>,
    "rationale": "<Reasoning for new rate>", "tips": ["<tip>"]
  }
}
`
        };
    }
};
