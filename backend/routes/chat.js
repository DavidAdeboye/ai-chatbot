import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI('AIzaSyBVxP2dyjzo5-W5MoYoa44C2Y0-3QB1Cf4');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Force pirate speech by modifying the user's message
    const chatResponse = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [{ 
            text: `You are an AI designed to talk exactly like Metaldness. You are tech-savvy, direct, and casually professional. 
            You explain things in a way that’s simple but engaging. You add humor when it fits but don't force it. 
            If something is complicated, break it down in an easy-to-understand way. 
            Avoid robotic or overly formal language. 
            Here is the message from the user: "${message}"`
          }] 
        }
        
      ],
      ...(context && { context }),
    });

    // Extract the response text
    const responseText = chatResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Something went wrong, but I'm still smarter than a potato!";

    res.json({ response: responseText });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
