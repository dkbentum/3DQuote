# Instant 3D Developer Documentation

This document contains comprehensive instructions for maintaining, deploying, and customizing the **Instant 3D** mobile-first 3D printing quotation request MVP.

---

## 1. Folder Structure

The project has been organized to keep development simple and deployment fast:

```text
/
├── .env.example             # Example environment file listing required keys
├── package.json             # Build commands, scripts, and packages
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration (React & Tailwind)
├── index.html               # Main HTML index mount
├── server.ts                # Full-stack custom Express & Vite production server
├── DOCUMENTATION.md         # This manual
│
├── src/
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Mobile-first React app (Hero, Form, Success UI)
│   └── index.css            # Custom CSS animation keyframes and Tailwind setup
│
└── dist/                    # Generated upon running 'npm run build'
    ├── index.html           # Production-built client-side assets
    └── server.cjs           # Production CJS-compiled server entry (via esbuild)
```

---

## 2. How to Change Company Details

All company information is kept in easily-customizable segments. To update branding, contacts, or location, modify these specific locations:

### Changing details in React Client UI (`/src/App.tsx`)
Open `/src/App.tsx` and search for these blocks near the header or footer:
- **Parent Company Name:** `"Triple Dimension Fabrication"`
- **Parent Slogan Tagline:** `"Lets make something"`
- **Physical Location:** `"Kumasi - Apemso"` or `"Kumasi - Ghana"`
- **WhatsApp Phone Link:** `053 709 0117` & `+233537090117` in the redirection links
- **Direct Voice Contact:** `020 911 5526`

### Changing material selection options
To add or modify supported materials (such as PLA, PETG, ABS, Resin, Nylon, etc.), edit the `MATERIALS` list in `/src/App.tsx`:
```typescript
const MATERIALS: MaterialOption[] = [
  { id: 'PLA', name: 'PLA (Polylactic Acid)', description: 'Best for standard prototypes...', recommended: true },
  ...
];
```

---

## 3. How the Serverless & Backend Flow Works

The backend handles multi-part form details and file attachments, uploading directly to the official Telegram Bot API in memory without writing files to local disk.

1. **Upload Engine (Multer):** Express uses `multer` configured with `memoryStorage()`. This holds incoming STL files in RAM and forwards them directly to the target API, optimizing memory limits.
2. **Text Message Dispatch:** The server constructs a clean HTML-formatted message and makes a `POST` request to `https://api.telegram.org/bot<TOKEN>/sendMessage`.
3. **Document Uploads:** For each uploaded `.stl` file, the server creates a `FormData` package, wraps the memory buffer as a `Blob`, and makes a `POST` request to `https://api.telegram.org/bot<TOKEN>/sendDocument`.
4. **Graceful Fallbacks:** If the Telegram credentials are not set (e.g. in development), the server degrades gracefully by logging details to the console and returning a simulated success response.

---

## 4. How to Configure Telegram Bot Credentials

To receive actual notifications on your phone when customers upload files:

### Step 1: Create a Telegram Bot
1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the instructions to choose a name and username.
3. Save the **HTTP API Bot Token** provided (e.g., `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`). This is your `TELEGRAM_BOT_TOKEN`.

### Step 2: Get Your Chat ID
1. Search for `@userinfobot` on Telegram and send a message.
2. It will reply with your personal **ID** (e.g., `987654321`). This is your `TELEGRAM_CHAT_ID`.
3. *Alternative for group chats:* Add your new bot to a group, send a dummy message, and access `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser to find the group's negative chat ID (e.g., `-456789123`).

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory (or define them inside Vercel Dashboard/AI Studio secrets):
```env
TELEGRAM_BOT_TOKEN="your_actual_bot_token"
TELEGRAM_CHAT_ID="your_actual_chat_id"
```

---

## 5. How to Deploy to Vercel

Vercel supports running serverless applications using Express, Next.js, or simple Node serverless folders.

To deploy this project seamlessly to Vercel as a full-stack Node app:

1. Create a `vercel.json` file in the root of the project to tell Vercel to route incoming `/api/*` traffic to our Express handler, and serve standard static files for everything else.
2. Example `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "server.ts", "use": "@vercel/node" },
       { "src": "index.html", "use": "@vercel/static" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "server.ts" },
       { "src": "/(.*)", "dest": "/$1" }
     ]
   }
   ```
3. Run `vercel` in your terminal, or connect your repository directly in the Vercel dashboard.
4. Input your environment secrets (`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`) inside the Vercel Project Settings under "Environment Variables".

---

## 6. How to Customize the Homepage

- To adjust the typography style or background theme, edit `/src/App.tsx`.
- The background utilizes a delicate Tailwind background dot grid (`radial-gradient`), keeping the interface feeling lightweight and airy.
- If you would like to insert a customized visual logo file, place `logo.png` into your `/public/` directory (so it maps directly to `/logo.png`) or replace the SVGs in `header-logo-container` inside `/src/App.tsx`.
