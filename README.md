# ⚡ Upwork Profile Optimizer

An AI-powered Chrome extension + Next.js dashboard to score, rewrite, and optimize your Upwork profile — built with Next.js 14, Tailwind CSS, and Claude AI.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Next.js Dashboard

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your Anthropic API key.

### 3. Install the Chrome Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from this project
5. The extension icon will appear in your toolbar

---

## 📁 Project Structure

```
upwork-optimizer/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home / API key setup
│   ├── dashboard/
│   │   └── page.tsx              # Main analysis dashboard
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Claude AI API route
│   └── globals.css               # Tailwind + global styles
│
├── components/                   # Reusable React components
│   ├── ScoreRing.tsx             # Animated SVG score ring
│   ├── ScoreBar.tsx              # Animated progress bars
│   ├── CopyButton.tsx            # Copy to clipboard button
│   └── ImprovementCard.tsx       # Improvement action card
│
├── types/
│   └── index.ts                  # TypeScript types
│
├── extension/                    # Chrome Extension (MV3)
│   ├── manifest.json             # Extension manifest
│   ├── background.js             # Service worker (calls Claude API)
│   ├── content.js                # Injected on Upwork profile pages
│   ├── popup.html                # Extension popup UI
│   ├── popup.js                  # Popup logic
│   └── icons/                   # Extension icons (16, 48, 128px)
│
├── scripts/
│   └── generate-icons.js         # Icon generation helper
│
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🔧 How It Works

### Chrome Extension Flow

1. User visits any Upwork freelancer profile (`upwork.com/freelancers/*`)
2. Content script (`content.js`) injects a floating **"⚡ Optimize Profile"** button
3. User clicks the button → side panel slides in
4. Panel auto-detects profile data from the DOM (name, title, rate, bio, skills, portfolio)
5. User enters their Anthropic API key (saved locally in `chrome.storage.local`)
6. Background service worker sends profile data to Claude Sonnet API
7. Results displayed in the panel: score, rewrites, skills gap, rate suggestions

### Next.js Dashboard Flow

1. Visit `http://localhost:3000` → enter API key
2. Navigate to `/dashboard`
3. Manually enter profile data (or paste from your Upwork profile)
4. Click "Run AI Analysis" → calls `/api/analyze` route
5. Results displayed with tabs: Score, Top Fixes, Headline, Bio, Skills, Rate, Portfolio

---

## 🎯 Features

| Feature | Extension | Dashboard |
|---------|-----------|-----------|
| Auto-scrape profile data | ✅ | ❌ (manual) |
| Profile score (0–100) | ✅ | ✅ |
| Headline rewrite | ✅ | ✅ |
| Bio rewrite | ✅ | ✅ |
| Skills gap analysis | ✅ | ✅ |
| Rate suggestions | ✅ | ✅ |
| Portfolio tips | ✅ | ✅ |
| Competitor comparison | ✅ | ✅ |
| Copy rewrites to clipboard | ✅ | ✅ |
| Re-analyze | ✅ | ✅ |

---

## 🔑 API Key

You need an Anthropic API key to use this tool.

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key under **API Keys**
3. Enter it in the extension popup or dashboard home page

Your key is **stored locally** (browser localStorage / chrome.storage.local) and is **never sent to any third-party server**. It goes directly from your browser to the Anthropic API.

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Syne (display) + DM Sans (body) + JetBrains Mono (code)
- **Icons**: Lucide React
- **AI**: Claude Sonnet (`claude-sonnet-4-20250514`) via Anthropic API
- **Extension**: Chrome MV3 (Manifest V3)

---

## 🚢 Deployment

### Deploy Dashboard to Vercel

```bash
npx vercel --prod
```

After deploying, update the `DASHBOARD_URL` in `extension/popup.js`:

```js
const DASHBOARD_URL = "https://your-app.vercel.app";
```

### Publish Extension to Chrome Web Store

1. Zip the `extension/` folder
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Upload the zip and follow the submission process

---

## 📝 Customization

### Change the AI Model

In `extension/background.js` and `app/api/analyze/route.ts`:

```js
model: "claude-opus-4-20250514", // More powerful, slower
// or
model: "claude-haiku-4-5-20251001", // Faster, cheaper
```

### Adjust Score Weights

The scoring breakdown (headline: 25pts, bio: 25pts, skills: 20pts, portfolio: 20pts, rate: 10pts) can be customized in the prompt inside `background.js` or `route.ts`.

---

## ⚠️ Notes

- The extension's content script scrapes publicly visible data from Upwork profile pages. It only reads data; it never modifies the page content.
- Auto-detection works best on Upwork's standard freelancer profile pages (`/freelancers/~...`).
- If auto-detection misses some data, you can supplement it manually in the dashboard.

---

## 📄 License

MIT — build freely, optimize endlessly.