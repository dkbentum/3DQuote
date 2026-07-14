import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

// Load environment variables
dotenv.config();

let resolvedDirname = '';
try {
  resolvedDirname = __dirname;
} catch (e) {
  resolvedDirname = process.cwd();
}

const app = express();
const port = process.env.PORT || 3000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot: TelegramBot | null = null;
if (botToken && botToken !== 'MY_TELEGRAM_BOT_TOKEN') {
  bot = new TelegramBot(botToken);
}

// Use JSON and URL-encoded parsers with large limits
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Set up Multer for memory storage of STL uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1000 MB per file
  }
});

// API Route: Handle Quote & File Upload Submission
app.post('/api/upload', upload.array('files'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, whatsapp, material, quantity, description } = req.body;
    const files = req.files as Express.Multer.File[] || [];

    if (!name || !whatsapp) {
      res.status(400).json({ error: 'Name and WhatsApp number are required.' });
      return;
    }

    const orderId = `TD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const timestamp = new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' });

    // Create formatting for Telegram message
    const textMessage = `# <b>NEW 3D PRINT REQUEST</b>\n\n` +
      ` <b>Order ID:</b> ${orderId}\n` +
      ` <b>Customer:</b> ${name}\n` +
      ` <b>WhatsApp:</b> <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}">${whatsapp}</a>\n` +
      ` <b>Material:</b> ${material || 'Not specified'}\n` +
      ` <b>Quantity:</b> ${quantity || 1}\n` +
      ` <b>Description:</b> ${description || 'None provided'}\n\n` +
      ` <b>Submission Time:</b> ${timestamp}\n` +
      ` <b>Files:</b> ${files.length} attached`;

    // If Telegram secrets are not configured, simulate successful response for development environment
    if (!bot) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing or not configured. Simulating submission.');
      console.log('Simulated Telegram Message:\n', textMessage);
      console.log(`Attached Files: ${files.map(f => f.originalname).join(', ')}`);

      res.status(200).json({
        success: true,
        simulated: true,
        orderId: orderId,
        message: 'Quotation request simulated successfully! Set up TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in environment secrets to send to your actual bot.'
      });
      return;
    }

    // 1. Send the text details message to Telegram bot
    if (chatId) {
      await bot.sendMessage(chatId, textMessage, {
        parse_mode: 'HTML'
      });

      // 2. Upload all documents to the Telegram bot
      for (const file of files) {
        try {
          await bot.sendDocument(chatId, file.buffer, {
            caption: ` STL Model: ${file.originalname}\nFor customer: ${name}`
          }, {
            filename: file.originalname,
            contentType: file.mimetype || 'application/octet-stream'
          });
        } catch (err) {
          console.error(`Error uploading file ${file.originalname} to Telegram:`, err);
          // We continue to send other files even if one fails
        }
      }
    }

    res.status(200).json({ success: true, orderId: orderId });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    res.status(500).json({ error: error?.message || 'An unexpected error occurred during submission.' });
  }
});

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(resolvedDirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(resolvedDirname, 'dist/index.html'));
  });
} else {
  // In development mode, mount the Vite development middleware
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
  });
}

// Only listen locally, Vercel needs the exported app
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(` Instant 3D server running on port ${port} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

export default app;
