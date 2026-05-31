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
app.use(express.static(__dirname)); // Serves your landing, profile, and welcome layouts

// 3. Setup the Post Route for Chat Box Inputs
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
                systemInstruction: "You are the official HAGANAR AI Agent assistant. Keep your responses short, professional, elegant, and directly helpful for Mani's web ecosystem."
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI agent brain" });
    }
});

// Fallback to index if navigating directly
   app.use((req, res) => {
       res.sendFile(path.join(__dirname, 'index.html'));
   });

// 4. Start the Application Server
app.listen(PORT, () => {
    console.log(`🚀 HAGANAR Backend Active at: http://localhost:${PORT}`);
});