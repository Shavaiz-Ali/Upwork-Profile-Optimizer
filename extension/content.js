// content.js - Injected into Upwork profile pages

(function () {
  "use strict";

  if (document.getElementById("upo-root")) return;

  // ── Config ─────────────────────────────────────────────────────────────────
  const APP_URL = "http://localhost:3000";

  // ── Inject fonts and base theme styling ────────────────────────────────────
  const styleId = "upo-theme-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;500;600&display=swap');
            
            :root {
                --upo-bg:       #1c2132;
                --upo-card:     #252d42;
                --upo-card2:    #2b3450;
                --upo-input:    #222a3e;
                --upo-border:   #3a4460;
                --upo-fg:       #eaeef8;
                --upo-muted:    #8a93a8;
                --upo-dim:      #4e5a78;

                --upo-primary:        #6d5de6;
                --upo-primary-hover:  #5c4dce;
                --upo-primary-ring:   rgba(109, 93, 230, 0.28);
                --upo-primary-sub:    rgba(109, 93, 230, 0.10);
                --upo-primary-border: rgba(109, 93, 230, 0.25);

                --upo-error:        #e36248;
                --upo-error-sub:    rgba(227, 98, 72, 0.10);
                
                --upo-warn:         #f59e0b;
                --upo-warn-sub:     rgba(245, 158, 11, 0.10);

                --upo-success:      #22c55e;
                --upo-success-sub:  rgba(34, 197, 94, 0.10);

                --upo-radius: 10px;
                --upo-shadow: 0 8px 32px rgba(0,0,0,0.4);
                --upo-font: 'Nunito', system-ui, sans-serif;
            }

            /* Reset within UPO scope */
            #upo-panel *, #upo-fab * {
                box-sizing: border-box;
                font-family: var(--upo-font);
            }

            /* FAB */
            #upo-fab {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 999999;
                background: linear-gradient(135deg, var(--upo-primary), var(--upo-primary-hover));
                color: #fff;
                box-shadow: 0 4px 20px var(--upo-primary-ring);
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px 12px 18px;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                font-family: var(--upo-font);
                font-weight: 800;
                font-size: 14px;
                cursor: pointer;
                transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s, background 0.2s;
            }
            #upo-fab:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 24px var(--upo-primary-ring); }
            #upo-fab:active { transform: translateY(0) scale(0.98); }

            /* Panel */
            #upo-panel {
                position: fixed;
                bottom: 84px;
                right: 24px;
                z-index: 999999;
                width: 380px;
                max-height: calc(100vh - 120px);
                background: var(--upo-bg);
                color: var(--upo-fg);
                border-radius: var(--upo-radius);
                box-shadow: var(--upo-shadow);
                border: 1px solid var(--upo-border);
                display: flex;
                flex-direction: column;
                transform-origin: bottom right;
                transform: scale(0.95);
                opacity: 0;
                pointer-events: none;
                transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s;
            }
            #upo-panel.open {
                transform: scale(1);
                opacity: 1;
                pointer-events: auto;
            }

            /* Header */
            .upo-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: var(--upo-card);
                border-bottom: 1px solid var(--upo-border);
                border-radius: var(--upo-radius) var(--upo-radius) 0 0;
            }
            .upo-logo { display: flex; align-items: center; gap: 10px; }
            .upo-logo-icon {
                width: 40px; height: 40px;
                border-radius: 8px;
                background: var(--upo-primary-sub);
                border: 1px solid var(--upo-primary-border);
                display: flex; align-items: center; justify-content: center;
                color: var(--upo-primary);
            }
            .upo-logo-text { font-size: 14px; font-weight: 800; }
            .upo-badge {
                font-size: 10px; font-weight: 700; padding: 3px 9px;
                border-radius: 20px; background: var(--upo-primary-sub);
                border: 1px solid var(--upo-primary-border); color: var(--upo-primary);
            }
            .upo-close {
                background: none; border: none; color: var(--upo-muted);
                cursor: pointer; padding: 4px; border-radius: 6px;
                transition: background 0.15s, color 0.15s;
                margin-left: 8px;
            }
            .upo-close:hover { background: var(--upo-card2); color: var(--upo-fg); }

            /* Body ScrollArea */
            .upo-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                font-size: 13.5px;
                line-height: 1.5;
                display: flex;
                flex-direction: column;
            }
            .upo-body::-webkit-scrollbar { width: 6px; }
            .upo-body::-webkit-scrollbar-thumb { background: var(--upo-border); border-radius: 4px; }

            /* Forms / Buttons */
            .upo-input-wrap { position: relative; margin-bottom: 4px; }
            .upo-input-icon {
                position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
                color: var(--upo-dim); pointer-events: none; display: flex;
            }
            .upo-input {
                width: 100%; padding: 10px 12px 10px 36px;
                background: var(--upo-input); border: 1px solid var(--upo-border);
                border-radius: var(--upo-radius); color: var(--upo-fg);
                font-family: var(--upo-font); font-size: 13.5px; font-weight: 500;
                outline: none; transition: border-color 0.15s, box-shadow 0.15s;
            }
            .upo-input:focus { border-color: var(--upo-primary); box-shadow: 0 0 0 3px var(--upo-primary-ring); }
            
            .upo-btn {
                width: 100%; padding: 11px 16px; border: none; border-radius: var(--upo-radius);
                font-weight: 700; font-size: 13.5px; cursor: pointer;
                transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
                display: flex; align-items: center; justify-content: center; gap: 8px;
            }
            .upo-btn:active:not(:disabled) { transform: scale(0.98); }
            .upo-btn-primary { background: var(--upo-primary); color: #fff; }
            .upo-btn-primary:hover:not(:disabled) { background: var(--upo-primary-hover); box-shadow: 0 4px 20px var(--upo-primary-ring); }
            .upo-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
            .upo-btn-outline { background: transparent; color: var(--upo-muted); border: 1px solid var(--upo-border); }
            .upo-btn-outline:hover { background: var(--upo-primary-sub); color: var(--upo-primary); border-color: var(--upo-primary-border); }

            .upo-error-msg {
                background: var(--upo-error-sub); border: 1px solid var(--upo-error);
                color: var(--upo-error); padding: 10px; border-radius: var(--upo-radius);
                font-size: 12px; font-weight: 600; display: flex; align-items: flex-start; gap: 8px;
                margin-bottom: 16px; animation: upoFadeIn 0.3s forwards;
            }

            .upo-spinner-small {
                width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
                border-top-color: #fff; border-radius: 50%;
                animation: upoSpin 0.6s linear infinite;
            }
            .upo-spinner-large {
                width: 36px; height: 36px; border: 3px solid var(--upo-primary-sub);
                border-top-color: var(--upo-primary); border-radius: 50%;
                animation: upoSpin 0.8s linear infinite; margin: 0 auto 16px;
            }
            @keyframes upoSpin { to { transform: rotate(360deg); } }
            @keyframes upoFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

            /* Login specific */
            .upo-login-hero { text-align: center; margin-bottom: 24px; }
            .upo-hero-orb {
                width: 50px; height: 50px; border-radius: 14px; background: var(--upo-primary-sub);
                border: 1px solid var(--upo-primary-border); color: var(--upo-primary);
                display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
            }
            .upo-login-hero h1 { font-size: 17px; font-weight: 800; margin: 0 0 6px; }
            .upo-login-hero p { font-size: 12.5px; color: var(--upo-muted); margin: 0; }
            .upo-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--upo-muted); margin-bottom: 6px; }

            /* Ready to Analyze Screen */
            .upo-preview {
                background: var(--upo-card2); border: 1px solid var(--upo-border);
                border-radius: var(--upo-radius); padding: 14px; margin-bottom: 20px;
            }
            .upo-preview-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--upo-muted); letter-spacing: 0.05em; margin-bottom: 10px; display: flex; justify-content: space-between; }
            .upo-preview-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px; }
            .upo-preview-row:last-child { margin-bottom: 0; }
            .upo-preview-key { color: var(--upo-dim); }
            .upo-preview-val { color: var(--upo-fg); font-weight: 600; text-align: right; max-width: 65%; word-break: break-word; }
            .upo-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* Results view components */
            .upo-score-hero {
                display: flex; gap: 16px; align-items: center; padding: 16px;
                background: linear-gradient(135deg, var(--upo-card2), var(--upo-card));
                border: 1px solid var(--upo-border); border-radius: var(--upo-radius); margin-bottom: 20px;
            }
            .upo-overall-score { font-size: 36px; font-weight: 800; line-height: 1; }
            .upo-overall-label { font-size: 11px; color: var(--upo-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-top: 4px; }
            
            .upo-section-card {
                background: var(--upo-card2); border: 1px solid var(--upo-border);
                border-radius: var(--upo-radius); padding: 16px; margin-bottom: 12px;
            }
            .upo-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .upo-section-title { font-size: 15px; font-weight: 700; color: var(--upo-fg); display: flex; align-items: center; gap: 6px; }
            .upo-section-badge { padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
            .upo-section-feedback { font-size: 13px; color: var(--upo-muted); margin-bottom: 12px; }
            
            .upo-bullet-list { margin: 0; padding: 0 0 0 16px; color: var(--upo-fg); font-size: 13px; }
            .upo-bullet-list li { margin-bottom: 6px; line-height: 1.5; }

            .upo-keyword-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
            .upo-pill { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: 1px solid; }
            .upo-pill.present { background: var(--upo-success-sub); color: var(--upo-success); border-color: rgba(34, 197, 94, 0.3); }
            .upo-pill.missing { background: var(--upo-warn-sub); color: var(--upo-warn); border-color: rgba(245, 158, 11, 0.3); }

            .upo-improve-list { display: flex; flex-direction: column; gap: 8px; }
            .upo-improve-item { 
                background: var(--upo-bg); border: 1px solid var(--upo-border); 
                padding: 10px 12px; border-radius: 8px; font-size: 12.5px;
                display: flex; gap: 10px; line-height: 1.5;
            }
            .upo-improve-icon { color: var(--upo-primary); flex-shrink: 0; margin-top: 2px; }
        `;
    document.head.appendChild(style);
  }

  // ── Create the extension root 
  const root = document.createElement("div");
  root.id = "upo-root";
  document.body.appendChild(root);

  // ── Enhanced Profile Scraper ────────────────────────────────────────────────
  function scrapeProfile() {
    const scope = document.querySelector(".freelancer-profile") || document;

    const get = (selectors) => {
      for (const sel of selectors) {
        const els = scope.querySelectorAll(sel);
        for (const el of els) {
          if (el?.innerText?.trim() && !el.closest('nav') && !el.closest('footer')) {
            return el.innerText.trim();
          }
        }
      }
      return null;
    };

    const name = get(['[data-test="freelancer-name"]', ".identity-name", 'h1[itemprop="name"]', "h1"]);
    const title = get(['[data-test="title"]', ".freelancer-title", ".title", "h2"]);

    // Find hourly rate robustly
    let hourlyRate = get(['[data-test="hourly-rate"]', ".rate"]);
    if (!hourlyRate) {
      const allElements = scope.querySelectorAll("div, span, p");
      for (const el of allElements) {
        if (el.children.length === 0) {
          const text = el.innerText?.trim();
          if (text && /^\$\d+(\.\d+)?(\/hr)?$/i.test(text)) {
            hourlyRate = text;
            break;
          }
        }
      }
    }
    hourlyRate = hourlyRate?.match(/\$\d+(\.\d+)?/)?.[0] ?? null;

    // Long text for overview
    let overview = null;
    const bioSelectors = ['[data-test="overview"]', '[data-test="description"]', ".overview", '[class*="overview"]', '[class*="bio"]', 'article', 'main p'];
    for (const sel of bioSelectors) {
      const els = scope.querySelectorAll(sel);
      for (const el of els) {
        if (el?.innerText?.trim().length > 60) {
          overview = el.innerText.trim();
          break;
        }
      }
      if (overview) break;
    }

    const skillEls = scope.querySelectorAll('[data-test="skill"] a, .skill-badge, [class*="skill"] a, .skills-list li, span[data-cy="skill"]');
    const skills = Array.from(skillEls).map((el) => el.innerText?.trim()?.replace(/[\n\r]+/g, ' ')).filter(Boolean).slice(0, 25);

    return {
      name,
      title,
      hourlyRate,
      overview,
      skills: skills.join(", "),
      isLikelyProfile: !!(name || title || overview || skills.length > 0)
    };
  }

  // ── Build UI elements ──────────────────────────────────────────────────────
  const fab = document.createElement("div");
  fab.id = "upo-fab";
  fab.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Optimize Profile
    `;
  document.body.appendChild(fab);

  const panel = document.createElement("div");
  panel.id = "upo-panel";
  panel.innerHTML = `
        <div class="upo-header">
            <div class="upo-logo">
                <div class="upo-logo-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                </div>
                <span class="upo-logo-text">Profile Optimizer
                    <span class="upo-badge" style="display:block; margin-top: 1px;">AI Powered</span>
                </span>
            </div>
            <div style="display: flex;">
                <button class="upo-close" id="upo-dash-btn" title="Open Settings">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
                <button class="upo-close" id="upo-close-btn" title="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="upo-body" id="upo-body">
            <!-- Content injected dynamically -->
        </div>
    `;
  document.body.appendChild(panel);

  let panelOpen = false;

  // ── UI Rendering Logic ──────────────────────────────────────────────────────

  function renderLoginScreen(errorMsg = null) {
    const body = document.getElementById("upo-body");
    body.innerHTML = `
            <div class="upo-login-hero" style="margin-top: 10px;">
                <div class="upo-hero-orb">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <h1>Sign in to continue</h1>
                <p>Enter your email to access your API keys and models.</p>
            </div>

            ${errorMsg ? `<div class="upo-error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>${errorMsg}</div>
            </div>` : ''}

            <form id="upoLoginForm" style="margin-bottom: 20px;">
                <label class="upo-label">Email address</label>
                <div class="upo-input-wrap">
                    <span class="upo-input-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                    </span>
                    <input type="email" class="upo-input" id="upoEmailInput" placeholder="you@example.com" required />
                </div>
                <button type="submit" class="upo-btn upo-btn-primary" id="upoLoginBtn" style="margin-top: 16px;">
                    <span id="upoLoginText">Sign In</span>
                    <div class="upo-spinner-small" id="upoLoginSpinner" style="display:none;"></div>
                </button>
            </form>

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
                <div style="flex:1;height:1px;background:var(--upo-border);"></div>
                <span style="font-size:11px;color:var(--upo-dim);">New here?</span>
                <div style="flex:1;height:1px;background:var(--upo-border);"></div>
            </div>

            <button type="button" class="upo-btn upo-btn-outline" id="upoCreateAccountBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create an account
            </button>
        `;

    document.getElementById("upoCreateAccountBtn").addEventListener("click", () => {
      window.open(`${APP_URL}/signup`, "_blank");
    });

    document.getElementById("upoLoginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("upoEmailInput").value.trim();
      if (!email) return;

      const btn = document.getElementById("upoLoginBtn");
      const text = document.getElementById("upoLoginText");
      const spinner = document.getElementById("upoLoginSpinner");

      try {
        btn.disabled = true;
        text.style.display = "none";
        spinner.style.display = "block";

        const res = await fetch(`${APP_URL}/extension-api/me?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to sign in.");

        await chrome.storage.local.set({ authToken: data.token, userEmail: data.email });
        renderReadyScreen();
      } catch (err) {
        renderLoginScreen(err.message);
      }
    });
  }

  function renderReadyScreen(errorMsg = null) {
    const body = document.getElementById("upo-body");
    const profile = scrapeProfile();

    body.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; margin: 0 0 6px;">Ready to Analyze</h3>
                <p style="font-size: 12.5px; color: var(--upo-muted); margin: 0;">We will use your active AI Model configuration from the dashboard.</p>
            </div>

            <div class="upo-preview" style="border-color: ${!profile.isLikelyProfile ? 'var(--upo-warn)' : 'var(--upo-border)'}">
                <div class="upo-preview-label">
                    <span>Detected Profile Context</span>
                    ${!profile.isLikelyProfile ? '<span style="color:var(--upo-warn)">⚠️ Low Confidence</span>' : ''}
                </div>
                <div class="upo-preview-row"><span class="upo-preview-key">Name</span><span class="upo-preview-val upo-truncate">${profile.name || '-'}</span></div>
                <div class="upo-preview-row"><span class="upo-preview-key">Role</span><span class="upo-preview-val upo-truncate">${profile.title || '-'}</span></div>
                <div class="upo-preview-row"><span class="upo-preview-key">Rate</span><span class="upo-preview-val">${profile.hourlyRate || '-'}</span></div>
                <div class="upo-preview-row"><span class="upo-preview-key">Overview</span><span class="upo-preview-val">${profile.overview ? '✓ Detected' : '❌ Missing'}</span></div>
            </div>

            ${!profile.isLikelyProfile ? `
                <div style="font-size: 12px; color: var(--upo-warn); margin-bottom: 16px; background: var(--upo-warn-sub); padding: 10px; border-radius: var(--upo-radius);">
                    We couldn't detect a full Upwork profile on this page. Analysis quality may be degraded.
                </div>
            ` : ''}

            ${errorMsg ? `<div class="upo-error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>${errorMsg}</div>
            </div>` : ''}

            <button class="upo-btn upo-btn-primary" id="upo-analyze-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Analyze Profile
            </button>

            <button class="upo-btn upo-btn-outline" id="upo-logout-btn" style="margin-top: 10px; border:none; background: transparent; font-size: 12px;">Sign Out</button>
        `;

    document.getElementById("upo-logout-btn").addEventListener("click", async () => {
      await chrome.storage.local.remove(["authToken", "userEmail"]);
      renderLoginScreen();
    });

    document.getElementById("upo-analyze-btn").addEventListener("click", () => {
      // Include everything scraped
      const contentString = `
                Name: ${profile.name || "-"}
                Title: ${profile.title || "-"}
                Rate: ${profile.hourlyRate || "-"}
                Skills: ${profile.skills || "-"}
                Overview: ${profile.overview || "-"}
                Raw Page Text Fallback: ${!profile.isLikelyProfile ? document.body.innerText.substring(0, 3000) : ""}
            `;
      runAnalysis(contentString);
    });
  }

  function renderLoadingScreen() {
    document.getElementById("upo-body").innerHTML = `
            <div class="upo-loading" style="padding: 40px 0;">
                <div class="upo-spinner-large"></div>
                <h3>Running AI Analysis</h3>
                <p>Generating expert recommendations via API...</p>
                <p style="font-size:11px; margin-top: 8px;">Make sure your dashboard API key is active.</p>
            </div>
        `;
  }

  function renderResultsScreen(data) {
    const body = document.getElementById("upo-body");

    const getScoreBadge = (score) => {
      const color = score >= 80 ? 'var(--upo-success)' : score >= 50 ? 'var(--upo-warn)' : 'var(--upo-error)';
      const bg = score >= 80 ? 'var(--upo-success-sub)' : score >= 50 ? 'var(--upo-warn-sub)' : 'var(--upo-error-sub)';
      return `<span class="upo-section-badge" style="color:${color}; background:${bg}; border: 1px solid ${color}40">${score}/100</span>`;
    };

    const sectionsHtml = Object.entries(data.sections || {}).map(([key, section]) => `
            <div class="upo-section-card">
                <div class="upo-section-header">
                    <div class="upo-section-title" style="text-transform: capitalize;">${key}</div>
                    ${getScoreBadge(section.score)}
                </div>
                <div class="upo-section-feedback">${section.feedback}</div>
                <ul class="upo-bullet-list">
                    ${section.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `).join('');

    const presentKeys = (data.keywords?.present || []).map(k => `<span class="upo-pill present">${k}</span>`).join('');
    const missingKeys = (data.keywords?.missing || []).map(k => `<span class="upo-pill missing">+ ${k}</span>`).join('');

    body.innerHTML = `
            <div class="upo-score-hero">
                <div>
                    <div class="upo-overall-score" style="color: ${data.overallScore >= 80 ? 'var(--upo-success)' : 'var(--upo-warn)'}">${data.overallScore}</div>
                    <div class="upo-overall-label">Overall Score</div>
                </div>
                <div style="font-size: 13px; color: var(--upo-fg); flex: 1; line-height: 1.5;">
                    ${data.summary}
                </div>
            </div>

            <div class="upo-section-card">
                <div class="upo-section-title" style="margin-bottom: 12px;">Top Improvements</div>
                <div class="upo-improve-list">
                    ${(data.topImprovements || []).map(imp => `
                        <div class="upo-improve-item">
                            <svg class="upo-improve-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            <div>${imp}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="upo-section-card">
                <div class="upo-section-title" style="margin-bottom: 8px;">Keyword Health</div>
                ${missingKeys ? `<div style="font-size: 11px; color: var(--upo-muted); margin-top: 8px;">Missing / High Value</div>
                <div class="upo-keyword-pills">${missingKeys}</div>` : ''}
                ${presentKeys ? `<div style="font-size: 11px; color: var(--upo-muted); margin-top: 12px;">Detected</div>
                <div class="upo-keyword-pills">${presentKeys}</div>` : ''}
            </div>

            <hr style="border:0; border-top: 1px solid var(--upo-border); margin: 24px 0;" />
            
            <h3 style="font-size: 16px; margin: 0 0 16px; color: var(--upo-fg);">Section Breakdown</h3>
            ${sectionsHtml}

            <button class="upo-btn upo-btn-outline" id="upo-reanalyze-btn" style="margin-top:20px">↺ Run Again</button>
        `;

    document.getElementById("upo-reanalyze-btn").addEventListener("click", () => renderReadyScreen());
  }

  // ── API Call Logic ───────────────────────────────────────────────────────────
  async function runAnalysis(profileContent) {
    renderLoadingScreen();

    try {
      const storage = await chrome.storage.local.get(["authToken"]);
      if (!storage.authToken) {
        renderLoginScreen();
        return;
      }

      const res = await fetch(`${APP_URL}/extension-api/analyze-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${storage.authToken}`
        },
        body: JSON.stringify({ profileContent })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `HTTP error! status: ${res.status}`);
      }

      if (json.success && json.data) {
        renderResultsScreen(json.data);
      } else {
        throw new Error("Invalid response format received from API");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      renderReadyScreen(error.message); // fallback to ready screen and show error
    }
  }


  // ── Panel toggling ───────────────────────────────────────────────────────────
  function togglePanel() {
    panelOpen = !panelOpen;
    panel.classList.toggle("open", panelOpen);

    if (panelOpen) {
      chrome.storage.local.get(["authToken"], (res) => {
        if (!res.authToken) {
          renderLoginScreen();
        } else {
          renderReadyScreen();
        }
      });
    }
  }

  fab.addEventListener("click", togglePanel);
  document.getElementById("upo-close-btn").addEventListener("click", togglePanel);
  document.getElementById("upo-dash-btn").addEventListener("click", () => {
    window.open(`${APP_URL}/dashboard`, "_blank");
  });

  // ── Extension Cleanup (Self-Destruct when removed) ──────────────────────────
  // When the extension is disabled or removed, the scripts are orphaned.
  // chrome.runtime.id becomes undefined or accessing it throws an error.
  const checkInterval = setInterval(() => {
    try {
      // If the extension context is invalidated, this will throw or return falsy
      if (!chrome.runtime?.id) {
        throw new Error("Extension Context Invalidated");
      }
    } catch (e) {
      // Extension was removed/disabled/updated. Clean up DOM.
      clearInterval(checkInterval);
      document.getElementById("upo-root")?.remove();
      document.getElementById("upo-fab")?.remove();
      document.getElementById("upo-panel")?.remove();
      document.getElementById("upo-theme-style")?.remove();
    }
  }, 2000);

})();