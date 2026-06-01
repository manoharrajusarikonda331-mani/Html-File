import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configure Environment variables and Paths
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Gen AI with key from your secure .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 2. Add Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serves your landing, profile, home, and welcome layouts

/* ==========================================================================
   HAGANAR ROUTING MANAGEMENT PIPELINE
   ========================================================================== */

// Route A: Root Path - Automatically loads the primary entry portal gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route B1: Welcome Path - Serves your secure introductory welcome layout
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Route B2: Home Path - Serves your intelligent glassmorphism workspace dashboard
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Route B3: Profile Path - Serves your premium glassmorphism engineer profile node
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Route C: Administrative Gate Sign-In Interceptor Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials matching your project node name and lucky numbers (7 & 5)
    if (username === 'haganar' && password === 'admin') {
        console.log(`🔐 Authorization verified for system identity: ${username}`);
        
        // SUCCESS REDIRECT UPDATED: Directs the user frame straight into the welcome layout!
        res.redirect('/welcome');
    } else {
        console.warn(`⚠️ Entry attempt rejected: Invalid authorization tokens for: ${username}`);
        res.send('<h3>Access Denied: Invalid Administrative Tokens.</h3><a href="/">Return to Gate</a>');
    }
});

// Route D: Asynchronous Post Route for Chat Box Inputs (Interfacing with Google Cloud Node)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message context is empty" });
        }

        // Generate response streaming directly from the Gemini model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: message }] }],
            config: {
                systemInstruction: "You are the official HAGANAR AI Agent assistant. Keep your responses short, professional, and insightful."
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('CRITICAL AI ENGINE FAILURE:', error.message || error);
        
        // Dynamic fallback handler for temporary external 503 traffic spikes
        const errorString = String(error).toLowerCase();
        if (errorString.includes('503') || errorString.includes('unavailable') || errorString.includes('demand')) {
            return res.json({ reply: "🔄 System Pipeline Syncing: The neural engine is currently experiencing a high-demand traffic spike. Your connection path is functional—please try sending your token stream again in a moment!" });
        }
        
        // Standard error response fallback
        res.json({ reply: "I encountered a processing anomaly while tracing that stream layout. Please try your request again." });
    }
});

/* ==========================================================================
   APPLICATION SERVER LISTENER STATUS
   ========================================================================== */
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 HAGANAR Intelligent Network Active at http://localhost:${PORT}`);
    console.log(`📡 Production Architecture Online. Welcome back, Mani.`);
    console.log(`================================================================`);
});