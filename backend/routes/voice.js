import express from 'express';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';

const router = express.Router();
const textToSpeechClient = new TextToSpeechClient();
const storage = new Storage();

router.post('/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    res.send(response.audioContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 