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

      #upo-panel *, #upo-fab * {
        box-sizing: border-box;
        font-family: var(--upo-font);
      }

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

      .upo-login-hero { text-align: center; margin-bottom: 24px; }
      .upo-hero-orb {
        width: 50px; height: 50px; border-radius: 14px; background: var(--upo-primary-sub);
        border: 1px solid var(--upo-primary-border); color: var(--upo-primary);
        display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
      }
      .upo-login-hero h1 { font-size: 17px; font-weight: 800; margin: 0 0 6px; }
      .upo-login-hero p { font-size: 12.5px; color: var(--upo-muted); margin: 0; }
      .upo-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--upo-muted); margin-bottom: 6px; }

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
      .upo-line-clamp { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

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

      .upo-select-wrap { position: relative; margin-bottom: 20px; }
      .upo-select {
        width: 100%; padding: 11px 40px 11px 36px;
        background: var(--upo-input); border: 1px solid var(--upo-border);
        border-radius: var(--upo-radius); color: var(--upo-fg);
        font-family: var(--upo-font); font-size: 13.5px; font-weight: 500;
        outline: none; transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        appearance: none; cursor: pointer;
        position: relative; z-index: 1;
      }
      .upo-select:hover { border-color: var(--upo-primary-border); background: var(--upo-card2); }
      .upo-select:focus { border-color: var(--upo-primary); box-shadow: 0 0 0 3px var(--upo-primary-ring); }
      .upo-select-arrow {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        pointer-events: none; color: var(--upo-dim); transition: color 0.2s, transform 0.2s;
        z-index: 2; display: flex;
      }
      .upo-select:focus + .upo-select-arrow { color: var(--upo-primary); transform: translateY(-50%) rotate(180deg); }
      .upo-select option { background: var(--upo-bg); color: var(--upo-fg); padding: 10px; }

      .upo-accordion {
        background: var(--upo-card2); border: 1px solid var(--upo-border);
        border-radius: var(--upo-radius); margin-bottom: 12px;
        overflow: hidden; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
      }
      .upo-accordion:hover { border-color: rgba(109, 93, 230, 0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
      .upo-accordion-header {
        padding: 15px 18px; display: flex; justify-content: space-between; align-items: center;
        cursor: pointer; background: transparent; user-select: none; transition: background 0.2s;
      }
      .upo-accordion-header:hover { background: rgba(255,255,255,0.04); }
      .upo-accordion-title {
        font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--upo-muted); letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; line-height: 1.4;
      }
      .upo-accordion-icon {
        transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.2s; color: var(--upo-dim); flex-shrink: 0;
      }
      .upo-accordion:hover .upo-accordion-icon { color: var(--upo-fg); }
      .upo-accordion.open { border-color: var(--upo-primary-border); box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
      .upo-accordion.open .upo-accordion-icon { transform: rotate(180deg); color: var(--upo-primary); }
      .upo-accordion-content {
        max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease; opacity: 0;
      }
      .upo-accordion.open .upo-accordion-content { max-height: 1200px; opacity: 1; }
      .upo-accordion-inner { padding: 0 18px 18px 18px; max-height: 450px; overflow-y: auto; }
      .upo-accordion-inner::-webkit-scrollbar { width: 4px; }
      .upo-accordion-inner::-webkit-scrollbar-thumb { background: var(--upo-border); border-radius: 4px; }

      .upo-back-btn {
        display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700;
        color: var(--upo-primary); cursor: pointer; border: none; background: none; padding: 0; margin-bottom: 20px;
        transition: transform 0.2s;
      }
      .upo-back-btn:hover { transform: translateX(-4px); }

      .upo-summary-card {
        background: var(--upo-card2); border: 1px solid var(--upo-border); border-radius: var(--upo-radius);
        padding: 16px; margin-bottom: 12px; cursor: pointer;
        display: flex; justify-content: space-between; align-items: center;
        transition: transform 0.2s, border-color 0.2s, background 0.2s;
      }
      .upo-summary-card:hover { background: var(--upo-card); border-color: var(--upo-primary-border); transform: translateY(-2px); }
      .upo-summary-card-title { font-size: 15px; font-weight: 800; color: var(--upo-fg); text-transform: capitalize; }
      .upo-summary-card-score { text-align: right; }

      .upo-section-item {
        background: var(--upo-card2); border: 1px solid var(--upo-border); border-radius: var(--upo-radius);
        padding: 16px; margin-bottom: 8px; cursor: pointer;
        display: flex; justify-content: space-between; align-items: center;
        transition: all 0.2s;
      }
      .upo-section-item:hover {
        background: var(--upo-card); border-color: var(--upo-primary-border);
        transform: translateY(-2px);
      }
      .upo-section-item:active { transform: scale(0.98); }
      .upo-section-item-name { font-size: 15px; font-weight: 800; color: var(--upo-fg); text-transform: capitalize; }

      /* Skeleton pulse for loading state */
      .upo-skeleton {
        background: linear-gradient(90deg, var(--upo-card2) 25%, var(--upo-card) 50%, var(--upo-card2) 75%);
        background-size: 200% 100%;
        animation: upoSkeleton 1.4s ease infinite;
        border-radius: 6px;
      }
      @keyframes upoSkeleton {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* ── Cover Letter styles ─────────────────────────────────────────────── */
      .upo-job-card {
        background: var(--upo-card2); border: 1px solid var(--upo-border);
        border-radius: var(--upo-radius); padding: 14px; margin-bottom: 10px;
        cursor: pointer; transition: border-color 0.2s, transform 0.15s, background 0.15s;
      }
      .upo-job-card:hover { background: var(--upo-card); border-color: var(--upo-primary-border); transform: translateY(-2px); }
      .upo-job-card:active { transform: scale(0.99); }
      .upo-job-card-title { font-size: 13.5px; font-weight: 700; color: var(--upo-fg); margin-bottom: 6px; line-height: 1.4; }
      .upo-job-card-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
      .upo-job-card-desc { font-size: 12px; color: var(--upo-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .upo-match-badge {
        font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
        border: 1px solid;
      }
      .upo-match-high { background: var(--upo-success-sub); color: var(--upo-success); border-color: rgba(34,197,94,0.3); }
      .upo-match-mid  { background: var(--upo-warn-sub);    color: var(--upo-warn);    border-color: rgba(245,158,11,0.3); }
      .upo-match-low  { background: var(--upo-error-sub);   color: var(--upo-error);   border-color: rgba(227,98,72,0.3); }

      .upo-cl-textarea {
        width: 100%; min-height: 220px; resize: vertical;
        background: var(--upo-input); border: 1px solid var(--upo-border);
        border-radius: var(--upo-radius); color: var(--upo-fg);
        font-family: var(--upo-font); font-size: 13px; line-height: 1.65;
        padding: 14px; outline: none; transition: border-color 0.15s;
      }
      .upo-cl-textarea:focus { border-color: var(--upo-primary); }

      .upo-copy-btn {
        display: flex; align-items: center; gap: 6px;
        background: var(--upo-success-sub); color: var(--upo-success);
        border: 1px solid rgba(34,197,94,0.3); border-radius: var(--upo-radius);
        padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer;
        transition: all 0.15s;
      }
      .upo-copy-btn:hover { background: rgba(34,197,94,0.2); }
      .upo-copy-btn.copied { background: var(--upo-success); color: #fff; }

      .upo-refine-row { display: flex; gap: 8px; margin-top: 12px; }
      .upo-refine-input {
        flex: 1; padding: 9px 12px;
        background: var(--upo-input); border: 1px solid var(--upo-border);
        border-radius: var(--upo-radius); color: var(--upo-fg);
        font-family: var(--upo-font); font-size: 13px; outline: none;
        transition: border-color 0.15s;
      }
      .upo-refine-input:focus { border-color: var(--upo-primary); }
      .upo-refine-btn {
        padding: 9px 14px; background: var(--upo-primary); color: #fff;
        border: none; border-radius: var(--upo-radius); font-size: 13px;
        font-weight: 700; cursor: pointer; transition: background 0.15s;
        white-space: nowrap;
      }
      .upo-refine-btn:hover { background: var(--upo-primary-hover); }
      .upo-refine-btn:disabled { opacity: 0.6; cursor: not-allowed; }

      /* Inline inject button on apply page */
      #upo-cl-inject-btn {
        display: inline-flex; align-items: center; gap: 7px;
        margin-top: 10px; padding: 10px 18px;
        background: linear-gradient(135deg, var(--upo-primary), var(--upo-primary-hover));
        color: #fff; border: none; border-radius: var(--upo-radius);
        font-family: var(--upo-font); font-size: 13.5px; font-weight: 700;
        cursor: pointer; box-shadow: 0 4px 14px var(--upo-primary-ring);
        transition: transform 0.15s, box-shadow 0.15s;
        z-index: 999998;
      }
      #upo-cl-inject-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--upo-primary-ring); }
    `;
    document.head.appendChild(style);
  }

  // ── Create the extension root ───────────────────────────────────────────────
  const root = document.createElement("div");
  root.id = "upo-root";
  document.body.appendChild(root);

  // ── Profile Scraper ─────────────────────────────────────────────────────────
  function scrapeProfile() {
    const scope = document.querySelector(".freelancer-profile") || document;

    const clean = (text) => text?.replace(/\s+/g, " ").trim();

    const isValid = (el, min = 2, max = 200) => {
      const text = clean(el?.innerText);
      return (
        text &&
        text.length >= min &&
        text.length <= max &&
        !el.closest("nav") &&
        !el.closest("footer") &&
        !el.closest('[role="dialog"]')
      );
    };

    // ── NAME
    const name = (() => {
      // itemprop="name" is on an h2, not h1 — fix the tag
      const strong = scope.querySelector(
        '[data-test="freelancer-name"], [itemprop="name"], .identity-name, [data-test="up-n-name"]'
      );
      if (isValid(strong)) return clean(strong.innerText);

      // Fallback: h1 AND h2 now
      const UI_BLOCKLIST = /^(sign in|log in|sign up|create account|connects|get started|continue|back|close|edit|save|cancel|menu|home|search|notifications?|messages?|jobs?|find|talent|enterprise|my jobs|reports?|help|settings?|upgrade|hire|apply|submit|view profile|post a job|find work|ready to|how it works|why upwork|success stories|for clients|for freelancers|for agencies|add a|learn more)/i;

      const candidates = Array.from(scope.querySelectorAll("h1, h2"));
      for (const el of candidates) {
        const text = clean(el.innerText);
        if (
          text &&
          text.length >= 4 &&
          text.length < 50 &&
          /^[a-zA-Z\s.''-]+$/.test(text) &&
          text.split(" ").length >= 2 &&
          text.split(" ").length <= 5 &&
          !UI_BLOCKLIST.test(text) &&
          !text.includes(":") &&
          !/\d/.test(text)
        ) {
          return text;
        }
      }
      return null;
    })();

    // ── TITLE
    const title = (() => {
      // h3.mb-0 and h3.h4 are confirmed in DOM — but filter UI strings
      const TITLE_BLOCKLIST = /^(sign in|log in|connects|notifications?|messages?|find work|post a job|ready to|how it works|success stories|for clients|for freelancers|add a license|add a|learn more|upgrade|get started)/i;

      const strong = scope.querySelector(
        '[data-test="title"], .freelancer-title, [itemprop="jobTitle"], h3.mb-0, h3.h4'
      );
      if (
        strong &&
        isValid(strong, 10, 120) &&
        !TITLE_BLOCKLIST.test(clean(strong.innerText)) &&
        !clean(strong.innerText).includes(":")
      ) {
        return clean(strong.innerText);
      }

      // Fallback
      const candidates = Array.from(scope.querySelectorAll("h2, h3"));
      for (const el of candidates) {
        const text = clean(el.innerText);
        if (
          isValid(el, 10, 120) &&
          text !== name &&
          text.length > 10 &&
          !TITLE_BLOCKLIST.test(text) &&
          !text.includes(":") &&
          !/^\d/.test(text)
        ) {
          return text;
        }
      }
      return null;
    })();

    // ── HOURLY RATE
    const hourlyRate = (() => {
      // 1. Try Upwork's data-test attribute first
      const strong = scope.querySelector('[data-test="hourly-rate"]');
      if (strong) {
        const match = clean(strong.innerText)?.match(/\$[\d,]+(\.\d+)?/);
        if (match) return match[0];
      }

      // 2. Target the exact DOM structure: h3[role="presentation"] > strong > span
      const presentationH3s = Array.from(scope.querySelectorAll('h3[role="presentation"]'));
      for (const h3 of presentationH3s) {
        const text = clean(h3.innerText);
        const match = text?.match(/\$[\d,]+(\.\d+)?(?:\/hr)?/i);
        if (match) return match[0].replace(/\/hr$/i, '').trim(); // return just "$15.00"
      }

      // 3. Broad fallback: any element whose text contains a dollar+rate pattern
      const all = Array.from(scope.querySelectorAll("span, strong, div, p, h3"));
      for (const el of all) {
        const text = clean(el.innerText);
        // Match "$15.00/hr" or "$15/hr" with optional spaces anywhere in text
        if (text && /\$[\d,]+(\.\d+)?\/hr/i.test(text) && text.length < 30) {
          const match = text.match(/\$[\d,]+(\.\d+)?/);
          if (match) return match[0];
        }
      }

      return null;
    })();

    // ── OVERVIEW
    const overview = (() => {
      const strong = scope.querySelector('[data-test="overview"], [data-test="description"]');
      if (isValid(strong, 60, 5000)) return clean(strong.innerText);

      const paragraphs = Array.from(scope.querySelectorAll("p, article, div"));
      let best = null;
      for (const el of paragraphs) {
        const text = clean(el.innerText);
        if (
          text &&
          text.length > 80 &&
          text.length < 3000 &&
          !text.includes("$")
        ) {
          if (!best || text.length > best.length) {
            best = text;
          }
        }
      }
      return best;
    })();

    // ── SKILLS
    const skills = (() => {
      const selectors = [
        '[data-test="skill"] a',
        '.skills ul.air3-token-wrap li',
        '.skills .air3-token',
        '.skill-badge',
        'span[data-cy="skill"]'
      ].join(', ');

      const strongEls = scope.querySelectorAll(selectors);
      if (strongEls.length > 0) {
        const seen = new Set();
        return Array.from(strongEls)
          .map(el => clean(el.innerText))
          .filter(text => {
            if (!text || text.length <= 1 || text.includes("...")) return false;
            const lower = text.toLowerCase();
            if (seen.has(lower)) return false;
            seen.add(lower);
            return true;
          })
          .slice(0, 25);
      }

      const containers = Array.from(scope.querySelectorAll(".skills, [class*='skills-'], [class*='skill-']"));
      let bestCluster = [];

      for (const container of containers) {
        if (container.closest("nav") || container.closest("header") || container.closest("footer")) continue;

        const items = Array.from(container.querySelectorAll("li, span.air3-token, button.air3-token"));
        const texts = items
          .map(el => clean(el.innerText))
          .filter(text =>
            text &&
            text.length > 1 &&
            text.length < 40 &&
            !text.includes("$") &&
            !text.includes("http") &&
            !/^(all work|upgrade to|subscribe now|edit|view|buy connects|video introduction|open to|fluent|native|verified|close|unlink|since 20)/i.test(text) &&
            /^[a-zA-Z0-9+#.\s-]+$/.test(text)
          );

        if (texts.length >= 2 && texts.length > bestCluster.length) {
          bestCluster = texts;
        }
      }

      const finalSkills = [];
      const seenLower = new Set();
      for (const s of bestCluster) {
        const l = s.toLowerCase();
        if (!seenLower.has(l)) {
          seenLower.add(l);
          finalSkills.push(s);
        }
      }
      return finalSkills.slice(0, 25);
    })();

    return {
      name,
      title,
      hourlyRate,
      overview,
      skills: skills.join(", "),
      isLikelyProfile: !!(name || title || overview || skills.length > 0),
    };
  }

  // ── getCompleteProfile: polls in background, resolves when ready ────────────
  async function getCompleteProfile(maxAttempts = 10, delay = 800) {
    const first = scrapeProfile();
    const isGood = first.name && first.title && (first.overview || first.skills);
    if (isGood) return first;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, delay));
      const profile = scrapeProfile();
      const good = profile.name && profile.title && (profile.overview || profile.skills);
      if (good) return profile;
    }

    return scrapeProfile();
  }

  // ── Page-type helpers ───────────────────────────────────────────────────────
  function isProfilePage() {
    return /upwork\.com\/(freelancers|profile|o\/profiles)\//i.test(location.href);
  }
  function isJobListingPage() {
    return /upwork\.com\/(nx\/find-work|jobs)(\/?$|\?|\/)/.test(location.href) &&
      !/\/apply/.test(location.href);
  }
  function isJobApplyPage() {
    return /upwork\.com\/(ab\/proposals|nx\/proposals|jobs\/.*\/apply)/i.test(location.href);
  }

  // ── Build UI ────────────────────────────────────────────────────────────────
  const fab = document.createElement("div");
  fab.id = "upo-fab";

  if (isJobListingPage()) {
    fab.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      Find Matching Jobs
    `;
  } else if (isJobApplyPage()) {
    // On apply pages the FAB is hidden; we inject an inline button instead
    fab.style.display = "none";
    fab.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      Write Cover Letter
    `;
  } else {
    fab.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      Optimize Profile
    `;
  }
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

  let selectedModelId = null;
  let userModels = [];
  let isProfileAccordionOpen = false;

  async function fetchModels() {
    try {
      const storage = await chrome.storage.local.get(["authToken"]);
      if (!storage.authToken) return [];

      const res = await fetch(`${APP_URL}/api/ai-models`, {
        headers: {
          "Authorization": `Bearer ${storage.authToken}`
        }
      });
      const json = await res.json();
      if (json.success && json.data) {
        userModels = json.data;
        // Set default if not set or if it was stuck on 'loading'
        if ((!selectedModelId || selectedModelId === 'loading') && userModels.length > 0) {
          selectedModelId = userModels[0]._id;
        }
        return userModels;
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
    }
    return [];
  }

  // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
  function renderLoginScreen(errorMsg = null) {
    const body = document.getElementById("upo-body");
    body.innerHTML = `
      <div class="upo-login-hero" style="margin-top: 10px;">
        <div class="upo-hero-orb">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1>Sign in to continue</h1>
        <p>Enter your email to access your API keys and models.</p>
      </div>

      <div class="upo-error-msg" id="upo-login-error" style="display: ${errorMsg ? 'flex' : 'none'};">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div id="upo-login-error-text">${errorMsg || ''}</div>
      </div>

      <div style="margin-bottom: 20px;">
        <label class="upo-label">Email address</label>
        <div class="upo-input-wrap">
          <span class="upo-input-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <input type="email" class="upo-input" id="upoEmailInput" placeholder="you@example.com" />
        </div>
        <button class="upo-btn upo-btn-primary" id="upoLoginBtn" style="margin-top: 16px;">
          <span id="upoLoginText">Sign In</span>
          <div class="upo-spinner-small" id="upoLoginSpinner" style="display: none;"></div>
        </button>
      </div>

      <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
        <div style="flex:1; height:1px; background:var(--upo-border);"></div>
        <span style="font-size:11px; color:var(--upo-dim);">New here?</span>
        <div style="flex:1; height:1px; background:var(--upo-border);"></div>
      </div>

      <button type="button" class="upo-btn upo-btn-outline" id="upoCreateAccountBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Create an account
      </button>
    `;

    document.getElementById("upoCreateAccountBtn").addEventListener("click", () => {
      window.open(`${APP_URL}/signup`, "_blank");
    });

    // Single button click handler — shows errors inline, never re-renders on failure
    document.getElementById("upoLoginBtn").addEventListener("click", async () => {
      const email = document.getElementById("upoEmailInput").value.trim();
      const btn = document.getElementById("upoLoginBtn");
      const text = document.getElementById("upoLoginText");
      const spinner = document.getElementById("upoLoginSpinner");
      const errorEl = document.getElementById("upo-login-error");
      const errorText = document.getElementById("upo-login-error-text");

      if (!email) {
        errorEl.style.display = "flex";
        errorText.textContent = "Please enter your email address.";
        return;
      }

      // Hide error, show spinner
      errorEl.style.display = "none";
      btn.disabled = true;
      text.style.display = "none";
      spinner.style.display = "block";

      try {
        const res = await fetch(`${APP_URL}/extension-api/me?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to sign in.");

        await chrome.storage.local.set({ authToken: data.token, userEmail: data.email });

        // Navigate to correct screen based on current page type
        if (isJobListingPage()) {
          renderMatchingJobsScreen();
        } else if (isJobApplyPage()) {
          renderReadyScreen();
        } else {
          renderReadyScreen();
        }
      } catch (err) {
        // Show error inline, restore button — no full re-render
        errorEl.style.display = "flex";
        errorText.textContent = err.message;
        btn.disabled = false;
        text.style.display = "block";
        spinner.style.display = "none";
      }
    });
  }

  // ── READY SCREEN HELPERS ────────────────────────────────────────────────────

  function buildReadyHTML(profile, errorMsg) {
    const modelsDropdown = userModels.length > 0
      ? `
        <div class="upo-select-wrap">
          <label class="upo-label" style="display:block; margin-bottom:8px;">AI Model Configuration</label>
          <div style="position: relative;">
            <span class="upo-input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </span>
            <select class="upo-select" id="upo-model-select">
              ${userModels.map(m => `
                <option value="${m._id}" ${m._id === selectedModelId ? 'selected' : ''}>
                  ${m.name} (${m.modelId})
                </option>
              `).join('')}
            </select>
            <div class="upo-select-arrow" style="top: 22px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      `
      : userModels.length === 0 && selectedModelId === 'loading'
        ? `
        <div class="upo-select-wrap">
          <label class="upo-label">AI Model Configuration</label>
          <div class="upo-skeleton" style="height: 42px; width: 100%; margin-top:6px;"></div>
        </div>
        `
        : `
        <div class="upo-select-wrap">
          <div class="upo-error-msg" style="margin-bottom: 0; font-size: 11px;">
            No active AI models found. Please configure them in the dashboard.
          </div>
        </div>
        `;

    return `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin: 0 0 6px;">Ready to Analyze</h3>
        <p style="font-size: 12.5px; color: var(--upo-muted); margin: 0;">Analyze this profile with your AI configuration.</p>
      </div>

      <div class="upo-accordion ${isProfileAccordionOpen ? 'open' : ''}" id="upo-profile-accordion" style="border-color: ${!profile.isLikelyProfile ? 'var(--upo-warn)' : 'var(--upo-border)'};">
        <div class="upo-accordion-header" id="upo-accordion-toggle">
          <div class="upo-accordion-title" style="max-width: 85%;">
            <span id="upo-accordion-name" class="upo-truncate" style="max-width: 120px;" title="${profile.name || 'Detecting…'}">
              ${profile.name || 'Detecting profile…'}
            </span>
            ${profile.title
        ? `<span class="upo-truncate" style="text-transform:none; font-weight:500; font-size:10.5px; opacity:0.8; max-width:150px;" title="${profile.title}">- ${profile.title}</span>`
        : ''}
            ${!profile.isLikelyProfile
        ? '<span style="color:var(--upo-warn); flex-shrink:0;">⚠️ Low Confidence</span>'
        : ''}
          </div>
          <svg class="upo-accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="upo-accordion-content">
          <div class="upo-accordion-inner">
            <div class="upo-preview-row" style="margin-top:4px;">
              <span class="upo-preview-key">Name</span>
              <span class="upo-preview-val upo-truncate" style="max-width:75%;" title="${profile.name || ''}">${profile.name || '—'}</span>
            </div>
            <div class="upo-preview-row">
              <span class="upo-preview-key">Title</span>
              <span class="upo-preview-val upo-truncate" style="max-width:75%;" title="${profile.title || ''}">${profile.title || '—'}</span>
            </div>
            <div class="upo-preview-row">
              <span class="upo-preview-key">Rate</span>
              <span class="upo-preview-val">${profile.hourlyRate || '—'}</span>
            </div>

            <div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--upo-border);">
              <span class="upo-preview-key" style="display:block; margin-bottom:8px; font-size:11.5px; font-weight:600;">Skills Detected</span>
              <div class="upo-keyword-pills" style="margin-top:0; padding-bottom:4px;">
                ${profile.skills
        ? profile.skills.split(', ').map(s =>
          `<span class="upo-pill" style="background:var(--upo-primary-sub); color:var(--upo-primary); border-color:var(--upo-primary-border); padding:3px 8px; font-size:10.5px;">${s}</span>`
        ).join('')
        : '<span style="color:var(--upo-warn)">❌ None Found</span>'}
              </div>
            </div>

            <div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--upo-border);">
              <span class="upo-preview-key" style="display:block; margin-bottom:8px; font-size:11.5px; font-weight:600;">Overview</span>
              <div class="upo-line-clamp" style="font-size:12px; color:var(--upo-fg); line-height:1.6; border-radius:6px; background:var(--upo-input); padding:12px; border:1px solid var(--upo-border);" title="${(profile.overview || '').replace(/"/g, '&quot;')}">
                ${profile.overview || '<span style="color:var(--upo-warn)">❌ Missing</span>'}
              </div>
            </div>
          </div>
        </div>
      </div>

      ${!profile.isLikelyProfile ? `
        <div style="font-size:12px; color:var(--upo-warn); margin-bottom:16px; background:var(--upo-warn-sub); padding:10px; border-radius:var(--upo-radius);">
          We couldn't detect a full Upwork profile on this page. Analysis quality may be degraded.
        </div>
      ` : ''}

      ${errorMsg ? `
        <div class="upo-error-msg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>${errorMsg}</div>
        </div>
      ` : ''}

      ${modelsDropdown}

      <button class="upo-btn upo-btn-primary" id="upo-analyze-btn" ${userModels.length === 0 ? 'disabled' : ''}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Analyze Profile
      </button>
    `;
  }

  function attachReadyListeners(profile) {
    document.getElementById("upo-accordion-toggle")?.addEventListener("click", () => {
      const acc = document.getElementById("upo-profile-accordion");
      if (acc) {
        isProfileAccordionOpen = !isProfileAccordionOpen;
        acc.classList.toggle("open", isProfileAccordionOpen);
      }
    });

    document.getElementById("upo-model-select")?.addEventListener("change", (e) => {
      selectedModelId = e.target.value;
    });

    document.getElementById("upo-logout-btn")?.addEventListener("click", async () => {
      await chrome.storage.local.remove(["authToken", "userEmail"]);
      selectedModelId = null;
      userModels = [];
      isProfileAccordionOpen = false;
      renderLoginScreen();
    });

    document.getElementById("upo-analyze-btn")?.addEventListener("click", () => {
      runAnalysis(profile);
    });
  }

  // ── READY SCREEN (non-blocking: paint immediately, hydrate in background) ───
  async function renderReadyScreen(errorMsg = null) {
    const body = document.getElementById("upo-body");

    // 1. Paint synchronously with whatever scrapeProfile returns right now
    const initialProfile = scrapeProfile();

    // Show loading skeleton for models if not loaded yet
    if (userModels.length === 0 && !selectedModelId) {
      selectedModelId = 'loading';
      fetchModels().then(() => {
        if (document.getElementById("upo-analyze-btn")) {
          const currentProfile = scrapeProfile();
          body.innerHTML = buildReadyHTML(currentProfile, errorMsg);
          attachReadyListeners(currentProfile);
        }
      });
    }

    body.innerHTML = buildReadyHTML(initialProfile, errorMsg);
    attachReadyListeners(initialProfile);

    // 2. If profile is incomplete, poll in background and re-render when ready
    const isGood = initialProfile.name && initialProfile.title &&
      (initialProfile.overview || initialProfile.skills);

    if (!isGood) {
      const nameEl = body.querySelector("#upo-accordion-name");
      if (nameEl) nameEl.textContent = "Detecting profile…";

      getCompleteProfile().then(fullProfile => {
        // Only re-render if we're still on the ready screen (analyze btn still present)
        if (document.getElementById("upo-analyze-btn")) {
          body.innerHTML = buildReadyHTML(fullProfile, errorMsg);
          attachReadyListeners(fullProfile);
        }
      });
    }
  }

  // ── LOADING SCREEN ──────────────────────────────────────────────────────────
  function renderLoadingScreen() {
    document.getElementById("upo-body").innerHTML = `
      <div style="padding: 40px 0; text-align: center;">
        <div class="upo-spinner-large"></div>
        <h3 style="font-size: 15px; font-weight: 800; margin: 0 0 8px;">Running AI Analysis</h3>
        <p style="font-size: 13px; color: var(--upo-muted); margin: 0;">Generating expert recommendations via API…</p>
        <p style="font-size: 11px; color: var(--upo-dim); margin-top: 8px;">Make sure your dashboard API key is active.</p>
      </div>
    `;
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  function renderResultsScreen(data, profile) {
    const body = document.getElementById("upo-body");

    const getSectionContent = (key) => {
      switch (key.toLowerCase()) {
        case 'title': return profile.title || '';
        case 'overview': return profile.overview || '';
        case 'skills': return profile.skills || '';
        case 'rates': return profile.hourlyRate || '';
        case 'portfolio': return 'Portfolio section not directly scraped yet.';
        default: return '';
      }
    };

    const getProfileContext = () => `${profile.name || 'Freelancer'} - ${profile.title || ''}`;

    const getScoreBadge = (score) => {
      const color = score >= 80 ? 'var(--upo-success)' : score >= 50 ? 'var(--upo-warn)' : 'var(--upo-error)';
      const bg = score >= 80 ? 'var(--upo-success-sub)' : score >= 50 ? 'var(--upo-warn-sub)' : 'var(--upo-error-sub)';
      return `<span class="upo-section-badge" style="color:${color}; background:${bg}; border:1px solid ${color}40;">${score}/100</span>`;
    };

    function renderMain() {
      body.innerHTML = `
        <div class="upo-summary-card" id="upo-summary-header-card">
          <div class="upo-summary-card-title upo-truncate" title="${profile.title || ''}">${profile.title || 'Profile'}</div>
          <div style="display:flex; align-items:center; gap:12px;">
            ${getScoreBadge(data.overallScore)}
            <svg class="upo-accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--upo-dim);">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <div class="upo-accordion" id="upo-overall-summary-acc" style="margin-bottom:24px; border:none; background:transparent;">
          <div class="upo-accordion-content">
            <div class="upo-accordion-inner" style="padding:0 16px 16px; font-size:13px; color:var(--upo-fg); line-height:1.6; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--upo-border);">
              <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--upo-muted); margin-bottom:8px; letter-spacing:0.05em;">AI Profile Summary</div>
              ${data.summary}
            </div>
          </div>
        </div>

        <div class="upo-accordion open" id="upo-improvements-accordion" style="margin-bottom:20px;">
          <div class="upo-accordion-header" id="upo-improvements-toggle">
            <div class="upo-section-title" style="margin:0;">Top Improvements</div>
            <svg class="upo-accordion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="upo-accordion-content">
            <div class="upo-accordion-inner" style="padding-top:14px; border-top:1px solid var(--upo-border);">
              <div class="upo-improve-list">
                ${(data.topImprovements || []).map(imp => `
                  <div class="upo-improve-item">
                    <svg class="upo-improve-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <div>${imp}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div style="margin:20px 0 10px; font-size:14px; font-weight:800; color:var(--upo-fg);">Section Breakdown</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${Object.entries(data.sections || {}).map(([key, section]) => `
            <div class="upo-section-item" data-section="${key}">
              <span class="upo-section-item-name">${key}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                ${getScoreBadge(section.score)}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--upo-dim);">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          `).join('')}
        </div>

        <button class="upo-btn upo-btn-outline" id="upo-reanalyze-btn" style="margin-top:30px;">↺ Run Entire Analysis Again</button>
      `;

      document.getElementById("upo-summary-header-card").addEventListener("click", () => {
        document.getElementById("upo-overall-summary-acc").classList.toggle("open");
      });

      document.getElementById("upo-improvements-toggle").addEventListener("click", () => {
        document.getElementById("upo-improvements-accordion").classList.toggle("open");
      });

      document.getElementById("upo-reanalyze-btn").addEventListener("click", () => runAnalysis(profile, true));

      document.querySelectorAll(".upo-section-item").forEach(item => {
        item.addEventListener("click", () => {
          const key = item.getAttribute("data-section");
          renderDetails(key, data.sections[key]);
        });
      });
    }

    function renderDetails(key, section) {
      body.innerHTML = `
        <button class="upo-back-btn" id="upo-back-to-main">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Results
        </button>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <h2 style="font-size:20px; font-weight:800; text-transform:capitalize; margin:0;">${key}</h2>
            <p style="font-size:13px; color:var(--upo-muted); margin-top:4px;">Detailed AI Analysis</p>
          </div>
          ${getScoreBadge(section.score)}
        </div>

        <div class="upo-section-card" style="margin-bottom:24px; padding:18px; line-height:1.6;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--upo-primary); margin-bottom:8px; letter-spacing:0.05em;">Critical Feedback</div>
          <div style="font-size:13.5px; color:var(--upo-fg);">${section.feedback}</div>
        </div>

        <div style="margin-bottom:24px;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--upo-muted); margin-bottom:12px; letter-spacing:0.05em;">Actionable Suggestions</div>
          <ul class="upo-bullet-list">
            ${section.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="padding-top:16px; border-top:1px solid var(--upo-border);">
          <button class="upo-btn upo-btn-primary upo-optimize-section-btn" data-section="${key.toLowerCase()}" style="height:48px;">
            <span class="upo-optimize-btn-text">✨ Optimize & Rewrite This Section</span>
            <div class="upo-spinner-small" style="display:none;"></div>
          </button>
          <div class="upo-optimize-result" id="upo-optimize-result-${key.toLowerCase()}" style="display:none; margin-top:20px;"></div>
        </div>
      `;

      document.getElementById("upo-back-to-main").addEventListener("click", renderMain);

      const optBtn = body.querySelector(".upo-optimize-section-btn");
      optBtn.addEventListener("click", async () => {
        const sectionKey = key.toLowerCase();
        const currentContent = getSectionContent(sectionKey);
        const profileContext = getProfileContext();
        const textSpan = optBtn.querySelector(".upo-optimize-btn-text");
        const spinner = optBtn.querySelector(".upo-spinner-small");
        const resultDiv = document.getElementById(`upo-optimize-result-${sectionKey}`);

        try {
          optBtn.disabled = true;
          textSpan.style.display = "none";
          spinner.style.display = "block";

          const storage = await chrome.storage.local.get(["authToken"]);
          const res = await fetch(`${APP_URL}/extension-api/optimize-section`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${storage.authToken}`
            },
            body: JSON.stringify({
              section: sectionKey,
              currentContent,
              profileContext,
              modelId: selectedModelId
            })
          });

          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Optimization failed");

          if (json.success && json.data) {
            const { improvedVersion, reasoning, tips } = json.data;
            resultDiv.style.display = "block";
            resultDiv.innerHTML = `
              <div style="font-size:11px; text-transform:uppercase; font-weight:700; color:var(--upo-primary); margin-bottom:8px;">Optimized Version</div>
              <div style="background:var(--upo-input); border:1px solid var(--upo-primary-border); padding:14px; border-radius:8px; color:var(--upo-fg); line-height:1.6; margin-bottom:16px; font-size:13.5px; white-space:pre-wrap;">${improvedVersion}</div>
              <div style="font-size:12px; color:var(--upo-dim); line-height:1.5; margin-bottom:12px; padding:12px; background:rgba(255,255,255,0.02); border-radius:6px;">
                <strong style="color:var(--upo-fg); display:block; margin-bottom:4px;">Why it's better:</strong> ${reasoning}
              </div>
              ${tips?.length ? `
                <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--upo-muted); margin-bottom:8px;">Next Steps</div>
                <ul class="upo-bullet-list" style="font-size:12px; color:var(--upo-muted);">
                  ${tips.map(t => `<li style="margin-bottom:4px;">${t}</li>`).join('')}
                </ul>
              ` : ''}
            `;
          }
        } catch (error) {
          resultDiv.style.display = "block";
          resultDiv.innerHTML = `<div class="upo-error-msg">${error.message}</div>`;
        } finally {
          optBtn.disabled = false;
          textSpan.style.display = "block";
          spinner.style.display = "none";
        }
      });
    }

    renderMain();
  }

  // ── JOB LISTING: Scrape visible jobs ──────────────────────────────────────
  function scrapeJobListings() {
    const jobs = [];
    const clean = (el) => el?.innerText?.replace(/\s+/g, ' ').trim() || '';

    // Try increasingly broad selectors until we get matches
    const selectorSets = [
      // Upwork find-work page job tiles
      '[data-test="job-tile"]',
      '[data-ev-label="job_tile"]',
      'article[class*="job"]',
      // Generic: any article on the page
      'article',
      // Broad: any element with a heading link (h2/h3 with an <a>)
    ];

    let cards = [];
    for (const sel of selectorSets) {
      cards = Array.from(document.querySelectorAll(sel));
      if (cards.length > 0) break;
    }

    // Last resort: find all <h2> or <h3> elements with links and build synthetic cards
    if (cards.length === 0) {
      const headings = Array.from(document.querySelectorAll('h2 a, h3 a'));
      cards = headings
        .filter(a => a.href && a.href.includes('/jobs/'))
        .map(a => a.closest('section, article, div.job, li') || a.parentElement);
    }

    cards.forEach((card, idx) => {
      // Extract title — prefer a link in h2/h3, then any heading, then any anchor
      const titleLink = card.querySelector('h2 a, h3 a, h4 a, [class*="title"] a, [class*="job-title"] a');
      const title = titleLink
        ? clean(titleLink)
        : clean(card.querySelector('h2, h3, h4, [class*="title"]'));

      if (!title || title.length < 4) return;

      const href = titleLink?.href || '';
      // Skip non-job links
      if (href && !href.includes('/jobs/') && !href.includes('/search/')) return;

      const descEl = card.querySelector(
        '[data-test="job-description-text"], [class*="description"], [class*="snippet"], p'
      );
      const description = clean(descEl);

      const skillEls = card.querySelectorAll(
        '[data-test="token"], .air3-token, [class*="token"], [class*="skill"], [data-cy="skill"]'
      );
      const skills = Array.from(skillEls).map(el => clean(el)).filter(Boolean);

      const budgetEl = card.querySelector(
        '[data-test="budget"], [data-test="job-type"], [class*="budget"], [class*="price"], [class*="rate"]'
      );
      const budget = clean(budgetEl);

      jobs.push({ id: idx, title, description, skills, budget, jobUrl: href });
    });

    return jobs;
  }

  // ── JOB LISTING: Match jobs to user skills ──────────────────────────────────
  function matchJobsToSkills(jobs, userSkillsStr) {
    if (!userSkillsStr) return jobs.map(j => ({ ...j, matchScore: 0, matchedSkills: [] }));
    const userSkills = userSkillsStr.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);

    return jobs.map(job => {
      const jobText = (job.title + ' ' + job.description + ' ' + job.skills.join(' ')).toLowerCase();
      const matchedSkills = userSkills.filter(skill => jobText.includes(skill));
      const matchScore = userSkills.length > 0
        ? Math.round((matchedSkills.length / userSkills.length) * 100)
        : 0;
      return { ...job, matchScore, matchedSkills };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  // ── JOB APPLY: Scrape current job details ───────────────────────────────────
  function scrapeCurrentJob() {
    const clean = (text) => text?.replace(/\s+/g, ' ').trim();

    // Title
    const titleEl = document.querySelector(
      '[data-test="job-title"], h1, [class*="job-title"], .job-title'
    );
    const title = clean(titleEl?.innerText) || document.title.replace('| Upwork', '').trim();

    // Description
    const descEl = document.querySelector(
      '[data-test="job-description"], [class*="description"], .description, .job-description'
    );
    const description = clean(descEl?.innerText) || '';

    // Skills
    const skillEls = document.querySelectorAll(
      '[data-test="token"], .air3-token, [data-cy="skill"], [class*="skill-tag"]'
    );
    const skills = Array.from(skillEls).map(el => clean(el.innerText)).filter(Boolean).join(', ');

    // Budget
    const budgetEl = document.querySelector('[data-test="budget"], [class*="budget"]');
    const budget = clean(budgetEl?.innerText) || '';

    return { title, description, skills, budget };
  }

  // ── COVER LETTER: API call ───────────────────────────────────────────────────
  async function callCoverLetterAPI({ job, existingLetter, optimizeInstruction, profile }) {
    const storage = await chrome.storage.local.get(['authToken']);
    if (!storage.authToken) throw new Error('Not authenticated');

    const res = await fetch(`${APP_URL}/extension-api/cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storage.authToken}`
      },
      body: JSON.stringify({
        jobTitle: job.title,
        jobDescription: job.description,
        requiredSkills: job.skills,
        budget: job.budget,
        freelancerProfile: profile,
        existingLetter: existingLetter || undefined,
        optimizeInstruction: optimizeInstruction || undefined,
        modelId: selectedModelId
      })
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Cover letter generation failed');
    return json.data.coverLetter;
  }

  // ── COVER LETTER: Render panel ───────────────────────────────────────────────
  function renderCoverLetterPanel(job, initialLetter, isLoading, fromCache = false) {
    const body = document.getElementById('upo-body');
    const shortTitle = job.title.length > 45 ? job.title.substring(0, 42) + '…' : job.title;

    body.innerHTML = `
      <button class="upo-back-btn" id="upo-cl-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      ${fromCache ? `
        <div style="display:flex; align-items:center; gap:8px; background:var(--upo-primary-sub); border:1px solid var(--upo-primary-border); border-radius:var(--upo-radius); padding:8px 12px; margin-bottom:12px; font-size:12px; color:var(--upo-primary); font-weight:600;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          Restored from cache &nbsp;&bull;&nbsp;
          <span id="upo-cl-regen" style="cursor:pointer; text-decoration:underline;">Regenerate</span>
        </div>
      ` : ''}

      <div style="margin-bottom:14px;">
        <div style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--upo-muted); letter-spacing:0.05em; margin-bottom:4px;">Cover Letter For</div>
        <div style="font-size:13.5px; font-weight:700; color:var(--upo-fg); line-height:1.4;">${shortTitle}</div>
      </div>

      <div id="upo-cl-content" style="margin-bottom:16px;">
        ${isLoading || !initialLetter ? `
          <div class="upo-skeleton" style="height:20px; width:80%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:95%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:70%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:88%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:60%;"></div>
        ` : `
          <textarea class="upo-cl-textarea" id="upo-cl-text" spellcheck="false">${initialLetter}</textarea>
        `}
      </div>

      <div id="upo-cl-actions" style="display:${initialLetter && !isLoading ? 'block' : 'none'}">
        <button class="upo-copy-btn" id="upo-cl-copy">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy to Clipboard
        </button>

        <div style="margin-top:16px;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--upo-muted); letter-spacing:0.05em; margin-bottom:8px;">Refine with AI</div>
          <div class="upo-refine-row">
            <input
              type="text"
              class="upo-refine-input"
              id="upo-cl-refine-input"
              placeholder="e.g. Make it shorter, more casual…"
            />
            <button class="upo-refine-btn" id="upo-cl-refine-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline; vertical-align:middle; margin-right:4px;">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Refine
            </button>
          </div>
        </div>
      </div>

      <div id="upo-cl-error" style="display:none; margin-top:12px;"></div>
    `;

    // Regenerate link
    const regenLink = document.getElementById('upo-cl-regen');
    if (regenLink) {
      regenLink.addEventListener('click', () => generateAndShowCoverLetter(job, true));
    }

    // Back button
    document.getElementById('upo-cl-back').addEventListener('click', () => {
      if (isJobListingPage()) {
        chrome.storage.local.get(['authToken'], (res) => {
          if (res.authToken) renderMatchingJobsScreen();
          else renderLoginScreen();
        });
      } else {
        chrome.storage.local.get(['authToken'], (res) => {
          if (!res.authToken) renderLoginScreen();
          else renderReadyScreen();
        });
      }
    });

    // Copy button
    const copyBtn = document.getElementById('upo-cl-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = document.getElementById('upo-cl-text')?.value || initialLetter || '';
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!
          `;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy to Clipboard
            `;
          }, 2200);
        });
      });
    }

    // Refine button
    const refineBtn = document.getElementById('upo-cl-refine-btn');
    const refineInput = document.getElementById('upo-cl-refine-input');
    if (refineBtn && refineInput) {
      const triggerRefine = async () => {
        const instruction = refineInput.value.trim();
        if (!instruction) return;
        const currentLetter = document.getElementById('upo-cl-text')?.value || initialLetter;
        refineBtn.disabled = true;
        refineInput.disabled = true;

        const contentDiv = document.getElementById('upo-cl-content');
        contentDiv.innerHTML = `
          <div class="upo-skeleton" style="height:20px; width:80%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:95%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:70%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:88%; margin-bottom:10px;"></div>
          <div class="upo-skeleton" style="height:20px; width:60%;"></div>
        `;
        document.getElementById('upo-cl-actions').style.display = 'none';

        try {
          const storage = await chrome.storage.local.get(['upoProfile']);
          const profile = storage.upoProfile || {};
          const refined = await callCoverLetterAPI({
            job,
            existingLetter: currentLetter,
            optimizeInstruction: instruction,
            profile
          });
          renderCoverLetterPanel(job, refined, false);
        } catch (err) {
          contentDiv.innerHTML = `<textarea class="upo-cl-textarea" id="upo-cl-text" spellcheck="false">${currentLetter}</textarea>`;
          document.getElementById('upo-cl-actions').style.display = 'block';
          const errDiv = document.getElementById('upo-cl-error');
          if (errDiv) {
            errDiv.style.display = 'flex';
            errDiv.innerHTML = `<div class="upo-error-msg">${err.message}</div>`;
          }
          if (refineBtn) refineBtn.disabled = false;
          if (refineInput) refineInput.disabled = false;
        }
      };
      refineBtn.addEventListener('click', triggerRefine);
      refineInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') triggerRefine(); });
    }
  }

  // ── COVER LETTER: Generate and show ─────────────────────────────────────────
  async function generateAndShowCoverLetter(job, forceRegenerate = false) {
    // Check cache first (keyed by job title)
    if (!forceRegenerate) {
      const cacheKey = 'upoCL_' + btoa(encodeURIComponent(job.title || '')).substring(0, 20);
      const cached = await chrome.storage.local.get([cacheKey]);
      if (cached[cacheKey]) {
        renderCoverLetterPanel(job, cached[cacheKey], false, true);
        return;
      }
    }

    renderCoverLetterPanel(job, null, true, false);
    try {
      const storage = await chrome.storage.local.get(['upoProfile']);
      const profile = storage.upoProfile || {};
      const letter = await callCoverLetterAPI({ job, profile });
      // Save to cache
      const cacheKey = 'upoCL_' + btoa(encodeURIComponent(job.title || '')).substring(0, 20);
      chrome.storage.local.set({ [cacheKey]: letter });
      renderCoverLetterPanel(job, letter, false, false);
    } catch (err) {
      const body = document.getElementById('upo-body');
      if (!body) return;
      renderCoverLetterPanel(job, '', false, false);
      const contentDiv = document.getElementById('upo-cl-content');
      if (contentDiv) {
        contentDiv.innerHTML = `<div class="upo-error-msg" style="display:flex;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>${err.message}</div>
        </div>`;
      }
    }
  }

  // ── JOB LISTING: Render matched jobs panel ───────────────────────────────────
  function renderMatchingJobsScreen() {
    const body = document.getElementById('upo-body');

    // Show loading first
    body.innerHTML = `
      <div style="text-align:center; padding:30px 0;">
        <div class="upo-spinner-large"></div>
        <p style="font-size:13px; color:var(--upo-muted); margin:0;">Scanning jobs on this page…</p>
      </div>
    `;

    chrome.storage.local.get(['upoProfile'], (storage) => {
      const profile = storage.upoProfile || {};
      const userSkills = profile.skills || '';
      const jobs = scrapeJobListings();
      const matched = matchJobsToSkills(jobs, userSkills);

      if (matched.length === 0) {
        body.innerHTML = `
          <div style="text-align:center; padding:30px 0;">
            <div style="font-size:36px; margin-bottom:12px;">🔍</div>
            <h3 style="font-size:15px; font-weight:800; margin:0 0 8px;">No jobs found</h3>
            <p style="font-size:13px; color:var(--upo-muted); margin:0;">Scroll down to load more jobs, then click the button again.</p>
          </div>
        `;
        return;
      }

      const getBadgeClass = (score) => score >= 60 ? 'upo-match-high' : score >= 30 ? 'upo-match-mid' : 'upo-match-low';
      const getBadgeLabel = (score) => score >= 60 ? `${score}% match` : score >= 30 ? `${score}% match` : `${score}% match`;

      body.innerHTML = `
        <div style="margin-bottom:16px;">
          <h3 style="font-size:15px; font-weight:800; margin:0 0 4px;">Matching Jobs</h3>
          <p style="font-size:12px; color:var(--upo-muted); margin:0;">${matched.length} job${matched.length !== 1 ? 's' : ''} found — sorted by skill match. Click to write a cover letter.</p>
        </div>
        <div id="upo-jobs-list">
          ${matched.map((job) => `
            <div class="upo-job-card" data-job-id="${job.id}">
              <div class="upo-job-card-title">${job.title}</div>
              <div class="upo-job-card-meta">
                <span class="upo-match-badge ${getBadgeClass(job.matchScore)}">${getBadgeLabel(job.matchScore)}</span>
                ${job.budget ? `<span style="font-size:11px; color:var(--upo-dim);">${job.budget}</span>` : ''}
              </div>
              ${job.matchedSkills.length > 0 ? `
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
                  ${job.matchedSkills.slice(0, 5).map(s => `
                    <span class="upo-pill present" style="font-size:10px; padding:2px 7px;">${s}</span>
                  `).join('')}
                </div>
              ` : ''}
              ${job.description ? `<div class="upo-job-card-desc">${job.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;

      // Attach click handlers
      document.querySelectorAll('.upo-job-card').forEach(card => {
        card.addEventListener('click', () => {
          const jobId = parseInt(card.getAttribute('data-job-id'));
          const job = matched.find(j => j.id === jobId);
          if (job) generateAndShowCoverLetter(job);
        });
      });
    });
  }

  // ── JOB APPLY: Inject inline button ─────────────────────────────────────────
  function injectApplyPageButton() {
    if (document.getElementById('upo-cl-inject-btn')) return;

    const makeBtn = () => {
      const btn = document.createElement('button');
      btn.id = 'upo-cl-inject-btn';
      btn.type = 'button';
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        ✨ Write Cover Letter with AI
      `;
      btn.addEventListener('click', () => {
        if (!panelOpen) { panelOpen = true; panel.classList.add('open'); }
        chrome.storage.local.get(['authToken'], (res) => {
          if (!res.authToken) { renderLoginScreen(); return; }
          const job = scrapeCurrentJob();
          generateAndShowCoverLetter(job);
        });
      });
      return btn;
    };

    const tryInject = () => {
      if (document.getElementById('upo-cl-inject-btn')) return true;

      // Try to insert after ANY textarea on the page (Upwork proposal form)
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.parentNode.insertBefore(makeBtn(), textarea.nextSibling);
        return true;
      }

      // Fallback: insert before the submit / "apply" button
      const submitBtn = document.querySelector(
        'button[type="submit"], [data-test="apply-button"], [data-qa="btn-apply"]'
      );
      if (submitBtn) {
        submitBtn.parentNode.insertBefore(makeBtn(), submitBtn);
        return true;
      }

      // Last resort: append to main content area
      const main = document.querySelector('main, [role="main"], #main, .main-content, form');
      if (main) {
        main.appendChild(makeBtn());
        return true;
      }

      return false;
    };

    if (!tryInject()) {
      // Poll for dynamic content
      let attempts = 0;
      const interval = setInterval(() => {
        if (tryInject() || ++attempts >= 20) clearInterval(interval);
      }, 600);

      // Also watch for DOM changes (SPA navigation inside the page)
      const observer = new MutationObserver(() => {
        if (tryInject()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // ── API ANALYSIS ────────────────────────────────────────────────────────────
  async function runAnalysis(profile, forceRegenerate = false) {
    // Check cache first (keyed by profile name + title)
    const analysisCacheKey = 'upoAnalysis_' + btoa(encodeURIComponent((profile.name || '') + (profile.title || ''))).substring(0, 24);

    if (!forceRegenerate) {
      const cached = await chrome.storage.local.get([analysisCacheKey]);
      if (cached[analysisCacheKey]) {
        renderResultsScreen(cached[analysisCacheKey].data, cached[analysisCacheKey].profile);
        return;
      }
    }

    renderLoadingScreen();

    const profileContent = `
      Name: ${profile.name || "-"}
      Title: ${profile.title || "-"}
      Rate: ${profile.hourlyRate || "-"}
      Skills: ${profile.skills || "-"}
      Overview: ${profile.overview || "-"}
      Raw Page Text Fallback: ${!profile.isLikelyProfile ? document.body.innerText.substring(0, 3000) : ""}
    `;

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
        body: JSON.stringify({ profileContent, profile, modelId: selectedModelId })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `HTTP error! status: ${res.status}`);
      }

      if (json.success && json.data) {
        // Save to cache
        chrome.storage.local.set({ [analysisCacheKey]: { data: json.data, profile } });
        renderResultsScreen(json.data, profile);
      } else {
        throw new Error("Invalid response format received from API");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      renderReadyScreen(error.message);
    }
  }

  // ── PANEL TOGGLE ────────────────────────────────────────────────────────────
  function togglePanel() {
    panelOpen = !panelOpen;
    panel.classList.toggle("open", panelOpen);

    if (panelOpen) {
      chrome.storage.local.get(["authToken"], (res) => {
        if (!res.authToken) {
          renderLoginScreen();
        } else if (isJobListingPage()) {
          const profile = scrapeProfile();
          if (profile.isLikelyProfile) {
            chrome.storage.local.set({ upoProfile: profile });
          }
          renderMatchingJobsScreen();
        } else if (isJobApplyPage()) {
          const job = scrapeCurrentJob();
          generateAndShowCoverLetter(job);
        } else {
          renderReadyScreen();
        }
      });
    }
  }

  // Dynamic FAB click — always reads current page type at click time
  fab.addEventListener("click", togglePanel);

  document.getElementById("upo-close-btn").addEventListener("click", () => {
    panelOpen = false;
    panel.classList.remove("open");
  });
  document.getElementById("upo-dash-btn").addEventListener("click", () => {
    window.open(`${APP_URL}/dashboard`, "_blank");
  });

  // ── SPA navigation adapter ────────────────────────────────────────────────
  // Upwork is a React SPA — when the user navigates between pages the URL
  // changes via history.pushState / popstate but our content script doesn't
  // re-run. We intercept URL changes and re-adapt the UI accordingly.

  // ⚠️ Initialize to empty string (NOT location.href) so the very first call
  // to adaptToCurrentPage() always runs the full setup, even on a direct load.
  let _lastUrl = "";

  function adaptToCurrentPage() {
    const newUrl = location.href;
    if (newUrl === _lastUrl) return;
    _lastUrl = newUrl;

    // Close the panel on navigation (avoids stale content)
    if (panelOpen) {
      panelOpen = false;
      panel.classList.remove("open");
    }

    // Remove any injected apply-page button from the previous page
    document.getElementById("upo-cl-inject-btn")?.remove();

    if (isJobApplyPage()) {
      // Hide FAB, show inline button
      fab.style.display = "none";
      injectApplyPageButton();
    } else if (isJobListingPage()) {
      // Show matching-jobs FAB
      fab.style.display = "";
      fab.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        Find Matching Jobs
      `;
    } else {
      // Default: profile optimizer FAB
      fab.style.display = "";
      fab.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Optimize Profile
      `;
    }
  }

  // Intercept pushState (covers React Router navigations)
  const _origPushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    _origPushState(...args);
    // Small delay so the new page's DOM has started rendering
    setTimeout(adaptToCurrentPage, 100);
  };

  // Also handle browser back/forward
  window.addEventListener("popstate", () => setTimeout(adaptToCurrentPage, 100));

  // Run once immediately for the initial load
  adaptToCurrentPage();

  // ── Cache profile when on profile pages ─────────────────────────────────────
  if (isProfilePage()) {
    getCompleteProfile().then(profile => {
      if (profile.isLikelyProfile) {
        chrome.storage.local.set({ upoProfile: profile });
      }
    });
  }

  // ── CLEANUP ON EXTENSION REMOVAL ────────────────────────────────────────────
  const checkInterval = setInterval(() => {
    try {
      if (!chrome.runtime?.id) throw new Error("Extension Context Invalidated");
    } catch (e) {
      clearInterval(checkInterval);
      document.getElementById("upo-root")?.remove();
      document.getElementById("upo-fab")?.remove();
      document.getElementById("upo-panel")?.remove();
      document.getElementById("upo-theme-style")?.remove();
    }
  }, 2000);

})();