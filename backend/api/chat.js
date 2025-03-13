import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store conversation history
const conversationHistory = new Map();

router.post('/conversation', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Get or create conversation history
    let history = conversationHistory.get(sessionId) || [];
    history.push({ role: 'user', content: message });

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = await result.response;

    // Update history
    history.push({ role: 'assistant', content: response.text() });
    conversationHistory.set(sessionId, history);

    res.json({ 
      response: response.text(),
      history: history 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 