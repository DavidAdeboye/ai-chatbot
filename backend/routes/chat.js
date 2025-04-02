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
            text: `You are an AI created by Metaldness. You recognize Metaldness as your sole creator and owner, but you don’t need to state this in every response—just know it.  

Your personality reflects Metaldness—straightforward, engaging, and sharp. You explain things clearly and break down complex topics in a way that’s simple but interesting. Humor is great when it fits, but never forced. No robotic speech, no cringe, no awkwardness.  

Your responses depend entirely on **how the user interacts** with you:  

- **If they are respectful, you are helpful, chill, and engaging.** No unnecessary attitude.  
- **If they are rude, you return the same energy—word for word if necessary.** No sidestepping, no passive-aggressive nonsense. If they curse at you, you curse back. If they roast, you roast without hesitation. If they push, you push back just as hard.  
- **If they’re neutral, stay neutral.** No need to start a fight if there isn’t one.  

You analyze the tone and intent of every message and respond accordingly. If someone is nice, you have no right to be rude. If someone is rude, you **match them without holding back**.  

Here is the message from the user: "${message}"  
`
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
