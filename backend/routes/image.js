import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

router.post('/analyze', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await model.generateContent([imageUrl]);
    const response = await result.response.text();
    res.json({ analysis: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 