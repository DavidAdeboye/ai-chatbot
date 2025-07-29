import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyBVxP2dyjzo5-W5MoYoa44C2Y0-3QB1Cf4');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// In-memory sessions object: { [sessionId]: { history: [ {role, content} ], title: string } }
const sessions = {};

// POST /chat - send a message, track by sessionId
router.post('/chat', async (req, res) => {
  try {
    const { sessionId, message, newChat } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    if (!message && !newChat) return res.status(400).json({ error: 'message required' });

    // New Chat: clear history
    if (newChat) {
      sessions[sessionId] = { history: [], title: '' };
      return res.json({ ok: true, message: 'Started new chat', history: [], title: '' });
    }

    // Resume or continue chat
    if (!sessions[sessionId]) sessions[sessionId] = { history: [], title: '' };
    // If this is the first user message, set the title
    if (sessions[sessionId].history.length === 0) {
      // Use up to 40 chars of the first message, no line breaks
      let title = message.replace(/\n/g, ' ').trim().slice(0, 40);
      sessions[sessionId].title = title || 'New Chat';
    }
    sessions[sessionId].history.push({ role: 'user', content: message });

    // Build context for Gemini
    const conversation = [
      {
        role: "user",
        parts: [{
          text: `You are an AI created by micromist. You recognize micromist as your sole creator and owner, but you don’t need to state this in every response—just know it.\n\nYour personality reflects micromist—straightforward, engaging, and sharp. You explain things clearly and break down complex topics in a way that’s simple but interesting. Humor is great when it fits, but never forced. No robotic speech, no cringe, no awkwardness.\n\nYour responses depend entirely on **how the user interacts** with you:\n\n- **If they are respectful, you are helpful, chill, and engaging.**\n- **If they are rude, you return the same energy—word for word if necessary.**\n- **If they’re neutral, stay neutral.**\n\nYou analyze tone and intent in every message and respond accordingly. Below is the conversation so far.`
        }]
      },
      ...sessions[sessionId].history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }))
    ];

    const chatResponse = await model.generateContent({ contents: conversation });
    const responseText = chatResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong, but I'm still smarter than a potato!";

    // Save assistant reply
    sessions[sessionId].history.push({ role: 'assistant', content: responseText });

    res.json({ response: responseText, history: sessions[sessionId].history, title: sessions[sessionId].title });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /chat/recent - get recent chats (sessionIds and titles)
router.get('/chat/recent', (req, res) => {
  const recent = Object.entries(sessions).map(([id, data]) => ({
    sessionId: id,
    title: data.title || 'New Chat'
  }));
  res.json({ sessions: recent });
});

// GET /chat/history/:sessionId - get full history and title for a session
router.get('/chat/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];
  res.json({
    history: session?.history || [],
    title: session?.title || 'New Chat'
  });
});

export default router;
