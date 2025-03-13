import express from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.post('/schedule', async (req, res) => {
  try {
    const { summary, description, startTime, endTime } = req.body;
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    };
    
    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 