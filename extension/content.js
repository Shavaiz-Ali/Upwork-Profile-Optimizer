// content.js - Injected into Upwork profile pages

(function () {
  "use strict";

  if (document.getElementById("upo-root")) return;

  // Create the extension root just as a marker
  const root = document.createElement("div");
  root.id = "upo-root";
  document.body.appendChild(root);

  // ── Scrape profile data from the page ──────────────────────────────────────
  function scrapeProfile() {
    // Limit query scope to the profile container if it exists
    const scope = document.querySelector(".freelancer-profile") || document;

    const get = (selectors) => {
      for (const sel of selectors) {
        const el = scope.querySelector(sel);
        if (el?.innerText?.trim()) return el.innerText.trim();
      }
      return null;
    };

    const name = get([
      '[data-test="freelancer-name"]',
      ".identity-name",
      "h1",
    ]);

    const title = get([
      '[data-test="title"]',
      ".title",
      ".freelancer-title",
      "h2",
    ]);

    // Hourly rate - use optional chaining + regex pattern matching as fallback
    let hourlyRate = get(['[data-test="hourly-rate"]', ".rate"]);
    if (!hourlyRate) {
      scope.querySelectorAll("*").forEach((el) => {
        if (!hourlyRate && el.children.length === 0) {
          const text = el.innerText?.trim();
          if (text && /^\$\d+(\.\d+)?\/hr$/i.test(text)) {
            hourlyRate = text;
          }
        }
      });
    }
    // Additional normalization requested by user:
    hourlyRate = hourlyRate?.match(/\$\d+(\.\d+)?/)?.[0] ?? null;

    // Overview/Bio
    let overview = null;
    const bioSelectors = [
      '[data-test="overview"]',
      '[data-test="description"]',
      ".overview",
      '[class*="overview"]',
      '[class*="bio"]',
    ];
    for (const sel of bioSelectors) {
      const el = scope.querySelector(sel);
      if (el?.innerText?.trim().length > 80) {
        overview = el.innerText.trim();
        break;
      }
    }

    // Skills
    const skillEls = scope.querySelectorAll(
      '[data-test="skill"] a, .skill-badge, [class*="skill"] a'
    );
    const skills = Array.from(skillEls)
      .map((el) => el.innerText?.trim()?.replace(/[\n\r]+/g, ' '))
      .filter(Boolean)
      .slice(0, 25);

    // Portfolio
    const portfolioEls = scope.querySelectorAll(
      '[data-test="portfolio-item"], [class*="portfolio"] [class*="item"]'
    );
    const portfolioCount = portfolioEls.length;
    const portfolioDescriptions = Array.from(portfolioEls)
      .map((el) => el.innerText?.trim()?.replace(/[\n\r]+/g, ' ')?.slice(0, 120))
      .filter(Boolean)
      .slice(0, 5);

    // Stats
    const jobSuccess = get([
      '[data-test="job-success"]',
      '[class*="jobSuccess"]',
    ]);
    const totalEarnings = get([
      '[data-test="total-earnings"]',
      '[class*="earnings"]',
    ]);
    const topRated = !!scope.querySelector(
      '[data-test="top-rated"], [class*="topRated"]'
    );

    return {
      name,
      title,
      hourlyRate,
      overview,
      skills,
      portfolioCount,
      portfolioDescriptions,
      jobSuccess,
      totalEarnings,
      topRated,
    };
  }

  // ── Build FAB ──────────────────────────────────────────────────────────────
  const fab = document.createElement("div");
  fab.id = "upo-fab";
  fab.innerHTML = `
    <div class="upo-fab-dot"></div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    Optimize Profile
  `;
  document.body.appendChild(fab);

  // ── Build Panel ────────────────────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "upo-panel";
  panel.innerHTML = `
    <div class="upo-header">
      <div class="upo-logo">
        <div class="upo-logo-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span class="upo-logo-text">Profile Optimizer</span>
      </div>
      <button class="upo-close" id="upo-close-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="upo-body" id="upo-body">
      <!-- Content injected dynamically here, rather than rewriting the whole outer shell -->
    </div>
  `;
  document.body.appendChild(panel);

  let panelOpen = false;

  // Restore previous panel state
  chrome.storage.local.get(["panelOpen"], (res) => {
    if (res.panelOpen) {
      panelOpen = true;
      panel.classList.add("open");
      const profile = scrapeProfile();
      showApiKeyScreen(profile);
    }
  });

  // ── Screens ────────────────────────────────────────────────────────────────
  function showApiKeyScreen(profileData) {
    const body = document.getElementById("upo-body");
    const hasOverview = profileData.overview && profileData.overview.length > 20;

    body.innerHTML = `
      <div class="upo-welcome">
        <div class="upo-welcome-emoji">⚡</div>
        <h2>AI Profile Analysis</h2>
        <p>Get a detailed score, AI rewrites, skills gap analysis, and rate suggestions for your Upwork profile.</p>
      </div>

      ${hasOverview ? `
      <div class="upo-preview">
        <div class="upo-preview-label">Detected Profile Data</div>
        ${profileData.name ? `<div class="upo-preview-row"><span class="upo-preview-key">Name</span><span class="upo-preview-val">${profileData.name}</span></div>` : ""}
        ${profileData.title ? `<div class="upo-preview-row"><span class="upo-preview-key">Headline</span><span class="upo-preview-val truncate">${profileData.title}</span></div>` : ""}
        ${profileData.hourlyRate ? `<div class="upo-preview-row"><span class="upo-preview-key">Rate</span><span class="upo-preview-val">${profileData.hourlyRate}</span></div>` : ""}
        ${profileData.skills?.length ? `<div class="upo-preview-row"><span class="upo-preview-key">Skills</span><span class="upo-preview-val">${profileData.skills.slice(0, 5).join(", ")}${profileData.skills.length > 5 ? "..." : ""}</span></div>` : ""}
      </div>` : `
      <div class="upo-preview">
        <div class="upo-preview-label">Profile Data</div>
        <div class="upo-tip" style="margin:0">Could not auto-detect all data. AI will analyze what's available.</div>
      </div>`}

      <div class="upo-field">
        <label>Anthropic API Key</label>
        <input type="password" id="upo-key-input" placeholder="sk-ant-api03-..." />
        <div class="upo-hint">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Stored locally in browser. Never shared.
        </div>
      </div>

      <div id="upo-error-wrap"></div>

      <button class="upo-btn-primary" id="upo-analyze-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Analyze My Profile
      </button>
    `;

    // Pre-fill saved key
    chrome.storage.local.get(["apiKey"], (res) => {
      const input = document.getElementById("upo-key-input");
      if (res.apiKey && input) input.value = res.apiKey;
    });

    document.getElementById("upo-analyze-btn").addEventListener("click", () => {
      const key = document.getElementById("upo-key-input")?.value?.trim();
      if (!key) {
        showError("Please enter your Anthropic API key.");
        return;
      }
      chrome.storage.local.set({ apiKey: key });
      runAnalysis(profileData, key);
    });
  }

  function showLoadingScreen() {
    const body = document.getElementById("upo-body");
    body.innerHTML = `
      <div class="upo-loading">
        <div class="upo-spinner-wrap">
          <div class="upo-spinner"></div>
          <div class="upo-spinner-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
        </div>
        <h3>Analyzing Your Profile</h3>
        <p>Claude is reviewing every section of your profile...</p>
        <p style="font-size:11px;color:#30363d;margin-top:4px">This may take 10–20 seconds</p>
        <div id="upo-progressive-updates" style="display:flex;flex-direction:column;gap:4px;margin-top:10px;text-align:left;width:100%;">
           <!-- Progressive steps will be pushed here -->
        </div>
      </div>
    `;
  }

  // Exported so background can call it to inject intermediate stream chunks
  window.upoUpdateProgress = function (message) {
    const log = document.getElementById("upo-progressive-updates");
    if (log) {
      log.innerHTML += `<div style="font-size:11px;color:#22c55e;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg> ${message}</div>`;
    }
  };

  function showResultsScreen(data) {
    const body = document.getElementById("upo-body");

    // Safety Fallbacks in case LLM misses any keys
    const over = data.overallScore ?? 0;
    const hd = data.scoreBreakdown?.headline ?? 0;
    const bd = data.scoreBreakdown?.bio ?? 0;
    const sk = data.scoreBreakdown?.skills ?? 0;
    const pf = data.scoreBreakdown?.portfolio ?? 0;
    const rt = data.scoreBreakdown?.rate ?? 0;

    const scoreColor = over >= 80 ? "#22c55e" : over >= 60 ? "#f59e0b" : over >= 40 ? "#f97316" : "#ef4444";
    const circumference = 2 * Math.PI * 42;
    const offset = circumference * (1 - over / 100);

    body.innerHTML = `
      <!-- Score Hero -->
      <div class="upo-score-hero">
        <div class="upo-score-top">
          <div class="upo-score-ring-wrap">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#21262d" stroke-width="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="${scoreColor}" stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 50 50)"
                style="transition: stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1);filter:drop-shadow(0 0 6px ${scoreColor}66)"
              />
            </svg>
            <div class="upo-score-center">
              <span class="upo-score-num">${over}</span>
              <span class="upo-score-grade" style="color:${scoreColor}">${data.grade || "N/A"}</span>
            </div>
          </div>
          <div class="upo-score-right">
            <div class="upo-score-label">Profile Score</div>
            <div class="upo-score-sub">Overall optimization</div>
            <div class="upo-earn-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              +${data.potentialEarningsIncrease || "??"} potential
            </div>
          </div>
        </div>
        <div class="upo-bars">
          ${renderBar("Headline", hd, 25)}
          ${renderBar("Bio", bd, 25)}
          ${renderBar("Skills", sk, 20)}
          ${renderBar("Portfolio", pf, 20)}
          ${renderBar("Rate", rt, 10)}
        </div>
      </div>

      <!-- Tabs -->
      <div class="upo-tabs">
        <button class="upo-tab active" data-tab="improvements">🎯 Fixes</button>
        <button class="upo-tab" data-tab="headline">✍️ Headline</button>
        <button class="upo-tab" data-tab="bio">📝 Bio</button>
        <button class="upo-tab" data-tab="skills">🛠️ Skills</button>
        <button class="upo-tab" data-tab="rate">💰 Rate</button>
        <button class="upo-tab" data-tab="portfolio">🗂️ Portfolio</button>
      </div>

      <!-- Improvements tab -->
      <div class="upo-tab-pane active" id="tab-improvements">
        ${(data.topImprovements || []).map(imp => `
          <div class="upo-improvement">
            <div class="upo-imp-num">${imp.priority || "-"}</div>
            <div class="upo-imp-body">
              <div class="upo-imp-meta">
                <span class="upo-imp-cat">${imp.category || "General"}</span>
              </div>
              <div class="upo-imp-action">${imp.action || ""}</div>
              <div class="upo-imp-foot">
                <span class="upo-badge upo-badge-${imp.impact || "low"}">${imp.impact || "low"} impact</span>
                <span class="upo-badge upo-badge-low">${imp.effort || "low"} effort</span>
              </div>
            </div>
          </div>
        `).join("")}

        ${data.competitorComparison ? `
          <div class="upo-competitor">
            <div class="upo-competitor-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              vs. Top Freelancers
            </div>
            <p>${data.competitorComparison}</p>
          </div>
        ` : ""}
      </div>

      <!-- Headline tab -->
      <div class="upo-tab-pane" id="tab-headline">
        <div class="upo-section-score">
          <span class="upo-section-score-num" style="color:${getScoreColor(data.headline?.score)}">${data.headline?.score ?? 0}</span>
          <span class="upo-section-score-denom">/100</span>
        </div>
        ${(data.headline?.issues || []).map(i => `<div class="upo-issue">⚠ ${i}</div>`).join("")}
        ${data.headline?.rewrite ? `
          <div class="upo-rewrite">
            <div class="upo-rewrite-header">
              <div class="upo-rewrite-label">✨ AI Rewrite</div>
              <button class="upo-copy-btn" data-copy="${escAttr(data.headline.rewrite)}">Copy</button>
            </div>
            <div class="upo-rewrite-text">${data.headline.rewrite}</div>
          </div>
        ` : ""}
        <div class="upo-section-title" style="margin-top:14px">Pro Tips</div>
        ${(data.headline?.tips || []).map(t => `<div class="upo-tip">${t}</div>`).join("")}
      </div>

      <!-- Bio tab -->
      <div class="upo-tab-pane" id="tab-bio">
        <div class="upo-section-score">
          <span class="upo-section-score-num" style="color:${getScoreColor(data.bio?.score)}">${data.bio?.score ?? 0}</span>
          <span class="upo-section-score-denom">/100</span>
        </div>
        ${(data.bio?.issues || []).map(i => `<div class="upo-issue">⚠ ${i}</div>`).join("")}
        ${data.bio?.rewrite ? `
          <div class="upo-rewrite">
            <div class="upo-rewrite-header">
              <div class="upo-rewrite-label">✨ AI Rewrite</div>
              <button class="upo-copy-btn" data-copy="${escAttr(data.bio.rewrite)}">Copy</button>
            </div>
            <div class="upo-rewrite-text">${data.bio.rewrite}</div>
          </div>
        ` : ""}
        <div class="upo-section-title" style="margin-top:14px">Pro Tips</div>
        ${(data.bio?.tips || []).map(t => `<div class="upo-tip">${t}</div>`).join("")}
      </div>

      <!-- Skills tab -->
      <div class="upo-tab-pane" id="tab-skills">
        <div class="upo-section-score">
          <span class="upo-section-score-num" style="color:${getScoreColor(data.skills?.score)}">${data.skills?.score ?? 0}</span>
          <span class="upo-section-score-denom">/100 · ${data.skills?.currentCount ?? 0} detected</span>
        </div>
        ${data.skills?.missing?.length ? `
          <div class="upo-section-title">Add These Skills</div>
          <div class="upo-skill-tags">${data.skills.missing.map(s => `<span class="upo-tag upo-tag-add">+ ${s}</span>`).join("")}</div>
        ` : ""}
        ${data.skills?.redundant?.length ? `
          <div class="upo-section-title">Consider Removing</div>
          <div class="upo-skill-tags">${data.skills.redundant.map(s => `<span class="upo-tag upo-tag-remove">− ${s}</span>`).join("")}</div>
        ` : ""}
        <div class="upo-section-title" style="margin-top:14px">Pro Tips</div>
        ${(data.skills?.tips || []).map(t => `<div class="upo-tip">${t}</div>`).join("")}
      </div>

      <!-- Rate tab -->
      <div class="upo-tab-pane" id="tab-rate">
        <div class="upo-section-score">
          <span class="upo-section-score-num" style="color:${getScoreColor(data.rate?.score)}">${data.rate?.score ?? 0}</span>
          <span class="upo-section-score-denom">/100</span>
        </div>
        <div class="upo-rate-compare">
          <div class="upo-rate-box">
            <div class="upo-rate-box-label">Current</div>
            <div class="upo-rate-box-val">${data.rate?.currentRate || "N/A"}</div>
          </div>
          <div class="upo-rate-arrow">→</div>
          <div class="upo-rate-box suggested">
            <div class="upo-rate-box-label">Suggested</div>
            <div class="upo-rate-box-val">$${data.rate?.suggestedMin || 0}–$${data.rate?.suggestedMax || 0}/hr</div>
          </div>
        </div>
        ${data.rate?.rationale ? `<div class="upo-tip">${data.rate.rationale}</div>` : ""}
        <div class="upo-section-title">Pro Tips</div>
        ${(data.rate?.tips || []).map(t => `<div class="upo-tip">${t}</div>`).join("")}
      </div>

      <!-- Portfolio tab -->
      <div class="upo-tab-pane" id="tab-portfolio">
        <div class="upo-section-score">
          <span class="upo-section-score-num" style="color:${getScoreColor(data.portfolio?.score)}">${data.portfolio?.score ?? 0}</span>
          <span class="upo-section-score-denom">/100</span>
        </div>
        ${(data.portfolio?.issues || []).map(i => `<div class="upo-issue">⚠ ${i}</div>`).join("")}
        <div class="upo-section-title">Pro Tips</div>
        ${(data.portfolio?.tips || []).map(t => `<div class="upo-tip">${t}</div>`).join("")}
      </div>

      <button class="upo-btn-ghost" id="upo-reanalyze-btn" style="margin-top:20px">↺ Re-analyze Profile</button>
    `;

    // Tab switching
    body.querySelectorAll(".upo-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        body.querySelectorAll(".upo-tab").forEach((t) => t.classList.remove("active"));
        body.querySelectorAll(".upo-tab-pane").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        body.querySelector(`#tab-${tab.dataset.tab}`)?.classList.add("active");
      });
    });

    // Copy buttons
    body.querySelectorAll(".upo-copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(btn.dataset.copy);
        let origText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      });
    });

    // Re-analyze
    body.querySelector("#upo-reanalyze-btn")?.addEventListener("click", () => {
      const profile = scrapeProfile();
      showApiKeyScreen(profile);
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function renderBar(label, score, max) {
    const pct = Math.round((Math.min(score, max) / max) * 100) || 0;
    const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
    return `
      <div class="upo-bar-row">
        <span class="upo-bar-label">${label}</span>
        <div class="upo-bar-track">
          <div class="upo-bar-fill" style="width:${pct}%;background:${color};box-shadow:0 0 6px ${color}66"></div>
        </div>
        <span class="upo-bar-val">${score}/${max}</span>
      </div>
    `;
  }

  function getScoreColor(s) {
    if (!s && s !== 0) return "#8b949e";
    return s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : s >= 30 ? "#f97316" : "#ef4444";
  }

  function escAttr(str) {
    return (str || "").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function showError(msg) {
    const wrap = document.getElementById("upo-error-wrap");
    if (wrap) {
      wrap.innerHTML = `<div class="upo-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${msg}</div>`;
    }
  }

  // ── Run analysis ───────────────────────────────────────────────────────────
  function runAnalysis(profileData, apiKey) {
    showLoadingScreen();
    // Uses the newly extracted prompt generator
    const prompts = window.UPO_Prompts.getMultiStepPrompts(profileData);

    chrome.runtime.sendMessage(
      { action: "analyzeProfile", prompts, apiKey },
      (response) => {
        if (response?.success && response.data) {
          try {
            const parsed = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
            showResultsScreen(parsed);
          } catch (e) {
            const profile = scrapeProfile();
            showApiKeyScreen(profile);
            setTimeout(() => showError("AI response could not be parsed: <br/>" + e.message), 50);
          }
        } else {
          const profile = scrapeProfile();
          showApiKeyScreen(profile);
          setTimeout(() => showError(response?.error || "Analysis failed. Please try again."), 50);
        }
      }
    );
  }

  // Listener for progressive updates sent from background script
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "updateProgress" && msg.message) {
      window.upoUpdateProgress(msg.message);
    }
  });

  // ── Panel toggle ───────────────────────────────────────────────────────────
  fab.addEventListener("click", () => {
    panelOpen = !panelOpen;
    chrome.storage.local.set({ panelOpen }); // Persist toggled state
    panel.classList.toggle("open", panelOpen);
    if (panelOpen) {
      const profile = scrapeProfile();
      showApiKeyScreen(profile);
    }
  });

  document.getElementById("upo-close-btn").addEventListener("click", () => {
    panelOpen = false;
    chrome.storage.local.set({ panelOpen });
    panel.classList.remove("open");
  });
})();