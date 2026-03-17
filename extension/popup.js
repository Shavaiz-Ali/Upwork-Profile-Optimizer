// ─── Config ──────────────────────────────────────────────────────────────────
const APP_URL = "http://localhost:3000";

// ─── Refs ─────────────────────────────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const continueBtn = document.getElementById("continueBtn");
const btnLabel = document.getElementById("btnLabel");
const btnArrow = document.getElementById("btnArrow");
const btnSpinner = document.getElementById("btnSpinner");
const emailError = document.getElementById("emailError");
const emailErrorText = document.getElementById("emailErrorText");

// ─── Safe tab opener (works inside extension AND plain browser) ───────────────
function openTab(url) {
    if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.create({ url });
    } else {
        window.open(url, "_blank");
    }
}

// ─── Show / hide screens ─────────────────────────────────────────────────────
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function showFieldError(msg) {
    emailInput.classList.add("is-error");
    emailError.classList.add("show");
    emailErrorText.textContent = msg;
}
function clearFieldError() {
    emailInput.classList.remove("is-error");
    emailError.classList.remove("show");
}

function setLoading(on) {
    continueBtn.disabled = on;
    btnSpinner.style.display = on ? "block" : "none";
    btnArrow.style.display = on ? "none" : "block";
    btnLabel.textContent = on ? "Sending…" : "Continue";
}

// ─── AUTH GATE: check Chrome storage for token ───────────────────────────────
function init() {
    if (typeof chrome === "undefined" || !chrome.storage) {
        showScreen("screen-login");
        return;
    }
    chrome.storage.local.get(["authToken", "userEmail"], ({ authToken, userEmail }) => {
        if (authToken) {
            document.getElementById("userEmail").textContent = userEmail || "Account";
            document.getElementById("openDashboard").href = APP_URL + "/dashboard";
            document.getElementById("footerDashLink").href = APP_URL + "/dashboard";
            showScreen("screen-main");
            checkCurrentTab();
        } else {
            showScreen("screen-login");
        }
    });
}

// ─── Check if current tab is an Upwork profile ───────────────────────────────
function checkCurrentTab() {
    if (!chrome.tabs) return;
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab) return;
        const isProfile = /upwork\.com\/(freelancers|o\/profiles|profile)\//.test(tab.url || "");
        if (isProfile) {
            document.getElementById("statusDot").className = "status-dot active";
            document.getElementById("statusText").innerHTML = "<strong>Profile detected</strong> — ready to analyze";
        }
    });
}

// ─── Sign in form submit ──────────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldError();

    const email = emailInput.value.trim();
    if (!email) { showFieldError("Email address is required."); emailInput.focus(); return; }
    if (!isEmail(email)) { showFieldError("Please enter a valid email address."); emailInput.focus(); return; }

    setLoading(true);
    try {
        const res = await fetch(`${APP_URL}/extension-api/me?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        console.log(res);

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Account not found. Please sign up first.");

        if (data.token) {
            const save = (fn) => {
                if (typeof chrome !== "undefined" && chrome.storage) {
                    chrome.storage.local.set({ authToken: data.token, userEmail: email }, fn);
                } else {
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("userEmail", email);
                    fn();
                }
            };
            save(() => init());
        } else {
            showFieldError("✓ Check your inbox for the sign-in link.");
        }
    } catch (err) {
        showFieldError(err.message || "Network error. Check your connection.");
    } finally {
        setLoading(false);
    }
});

emailInput.addEventListener("input", clearFieldError);

// ─── Sign out ─────────────────────────────────────────────────────────────────
document.getElementById("signOutBtn").addEventListener("click", () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.remove(["authToken", "userEmail"], () => {
            showScreen("screen-login");
            emailInput.value = "";
        });
    }
});

// ─── Create account — opens /signup in a new tab ─────────────────────────────
document.getElementById("createAccountBtn").addEventListener("click", () => {
    openTab(`${APP_URL}/signup`);
});

// ─── External links ───────────────────────────────────────────────────────────
document.getElementById("termsLink").addEventListener("click", e => { e.preventDefault(); openTab(`${APP_URL}/terms`); });
document.getElementById("privacyLink").addEventListener("click", e => { e.preventDefault(); openTab(`${APP_URL}/privacy`); });

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
