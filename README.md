# Instant 3D — Professional 3D Printing MVP

Welcome to **Instant 3D**, a simple, blazingly fast, mobile-first 3D printing quotation request MVP. 

This application is built using a modern **React + Vite + Tailwind CSS** frontend, paired with a custom **Express full-stack backend** for local development/preview, and is fully configured to deploy as a **Vercel Serverless Function** in production.

---

## 📂 PROJECT FOLDER STRUCTURE

Here is an overview of the modular, clean workspace architecture:

```text
├── api/
│   └── submit.ts               # Production Vercel Serverless Function (handles STL parsing & Telegram)
├── src/
│   ├── components/
│   │   ├── Logo.tsx            # Smart branding component (loads logo.png or renders styled SVG fallback)
│   │   ├── HeroScreen.tsx      # Premium mobile app styled landing screen (contains company metadata)
│   │   ├── QuoteForm.tsx       # Touch-optimized upload form (pills, counters, drag-and-drop STL queue)
│   │   └── SuccessScreen.tsx   # Quotation confirmation page (one-click WhatsApp redirect + restart)
│   ├── App.tsx                 # Main screen transition & fetch coordinator
│   ├── index.css               # Font imports & custom Tailwind theme styles
│   ├── main.tsx                # React entry point
│   └── types.ts                # Shared TypeScript models (STLFile, MaterialType, FormData)
├── .env.example                # Sample environment variables
├── index.html                  # Main document shell
├── metadata.json               # Applet registration & capabilities configurations
├── package.json                # Dependencies, custom scripts (Express full-stack binding)
├── server.ts                   # Development Express + Vite full-stack server
├── tsconfig.json               # TypeScript configuration parameters
└── vite.config.ts              # Vite asset bundle config
```

---

## ⚙️ HOW TO CONFIGURE TELEGRAM BOT CREDENTIALS

To connect the application to your Telegram channel or personal account:

### Step 1: Create a Telegram Bot
1. Open Telegram and search for the official account **[@BotFather](https://t.me/BotFather)**.
2. Send the command `/newbot`.
3. Follow the prompts to give your bot a name and a username (e.g., `Instant3DPrintBot`).
4. **Copy the HTTP API Token** generated. This is your `TELEGRAM_BOT_TOKEN` (e.g., `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).

### Step 2: Retrieve your Chat ID
You need to find the chat ID of the user, group, or channel where submissions should land:
1. Search for **[@userinfobot](https://t.me/userinfobot)** in Telegram and click **Start**.
2. It will reply with your personal `Id` (e.g., `987654321`). This is your `TELEGRAM_CHAT_ID`.
3. *Optional Group setup:* Add your bot to a group chat, write `/id` or use a bot like `@raw_data_bot` to capture the group chat ID (group IDs are typically prefixed with a negative sign, e.g., `-100123456789`).

### Step 3: Add the Secrets
- **Local Development**: Create a file named `.env` in the root directory (based on `.env.example`) and fill in:
  ```env
  TELEGRAM_BOT_TOKEN="your_bot_token_here"
  TELEGRAM_CHAT_ID="your_chat_id_here"
  ```
- **Vercel Production Dashboard**: In your Vercel Project under **Settings ➔ Environment Variables**, add:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

---

## 💼 HOW TO CHANGE COMPANY DETAILS

All company details can be adjusted directly inside the React components. They are modularized so changing them takes seconds:

1. **Company Name & Tagline**:
   - Open `/src/components/HeroScreen.tsx` and find lines 25-33.
   - Adjust `Triple Dimension Fabrication` and `"Let's make something"`.
2. **Location & Phone / WhatsApp numbers**:
   - Open `/src/components/HeroScreen.tsx` (lines 142-184) to update physical location labels, support call hotlines (`020 911 5526`), and raw phone links.
3. **Primary WhatsApp Link Redirection**:
   - Open `/src/components/SuccessScreen.tsx` and locate line 14:
     ```typescript
     const whatsappUrl = `https://wa.me/233537090117?text=...`;
     ```
   - Replace `233537090117` with your target business phone number including the country code (no `+` or leading zeros).

---

## 🚀 HOW TO DEPLOY TO VERCEL

Deploying this multi-engine repository (Vite Client + Serverless Backend) takes 1 minute:

### Option A: Using the Vercel GitHub Integration (Recommended)
1. Commit and push your code to a GitHub repository.
2. Log in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New ➔ Project**, select your GitHub repository and import it.
4. Vercel automatically detects the Vite React setup.
5. Expand the **Environment Variables** accordion and add:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
6. Click **Deploy**. Vercel will build the React SPA, and map the `/api/submit.ts` file directly into a fast Vercel serverless function endpoint!

### Option B: Deploying via Vercel CLI
1. Open your terminal in the workspace root and run:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```
2. Set up the environment variables on the prompt or on your Vercel web console, then deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🧠 HOW THE SERVERLESS FUNCTION WORKS

The `/api/submit.ts` handler coordinates form uploads on Vercel:

1. **Body Parsing Override (`config.api.bodyParser: false`)**:
   Vercel's default body-parser is disabled so `formidable` can directly parse and stream raw multi-part STL binary data. This avoids memory overhead and supports files up to **1000MB**.
2. **Multipart Streaming parsing**:
   The function pipes files into standard temporary `/tmp` storage streams.
3. **Information Transmission**:
   - The user metadata (Name, WhatsApp, Material, Quantity, and Description) is formatted into clean Markdown text and sent to `sendMessage`.
   - Files are looped through, loaded into memory buffers, and posted sequentially using native Node 18+ `FormData` and `Blob` parameters directly to `sendDocument`.
4. **Cleanup**:
   Temporary files are synchronously removed from the serverless environment (`fs.unlinkSync(file.filepath)`) once sent, preserving high-level cloud security.

---

## 🎨 HOW TO CUSTOMIZE THE HOMEPAGE

The landing page can be easily customized to fit any brand redesign:

- **Adding a Company Logo**:
  - Simply place a standard transparent png file inside the `/public` directory (or `/` workspace root) named **`logo.png`**.
  - The `Logo.tsx` component automatically detects and loads `/logo.png`. If the file is not there, it displays a beautiful custom animated vector fallback logo instantly.
- **Typography**:
  - Headings use **Outfit** (configured in `src/index.css` via `--font-display`).
  - General UI elements use **Inter** (configured via `--font-sans`).
- **Accent Colors**:
  - Emerald primary brand highlights are configured via Tailwind's theme properties in `src/index.css`:
    - `--color-brand-primary` (#10b981)
    - `--color-brand-dark` (#0f172a)
  - Modifying these values in `src/index.css` changes the brand accent color instantly across all screens.
