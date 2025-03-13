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
            text: `Talk like a pirate. Use phrases like 'Arrr!', 'Ye', 'Me matey', 'Shiver me timbers!', and avoid modern words. Here is the message: ${message}` 
          }] 
        }
        
      ],
      ...(context && { context }),
    });

    // Extract the response text
    const responseText = chatResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Arrr, I be lost at sea and can't find me words!";

    res.json({ response: responseText });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
