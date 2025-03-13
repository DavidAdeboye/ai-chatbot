const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

exports.createChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create new chat with initial message
    const chat = new Chat({
      userId: req.user.userId,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    // Get Gemini response
    const result = await model.generateContent(message);
    const response = await result.response;
    const geminiResponse = response.text();

    // Add Gemini response to chat
    chat.messages.push({
      role: 'assistant',
      content: geminiResponse
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error: error.message });
  }
};

exports.updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.userId
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Get Gemini response using chat history for context
    const chatHistory = chat.messages.map(m => ({
      role: m.role,
      parts: m.content
    }));
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const geminiResponse = response.text();

    // Add Gemini response
    chat.messages.push({
      role: 'assistant',
      content: geminiResponse
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chat', error: error.message });
  }
}; 