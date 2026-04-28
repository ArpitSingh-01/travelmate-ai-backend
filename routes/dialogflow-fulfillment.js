/** AIML102 Unit 4 — Dialogflow Fulfillment Webhook
 * This endpoint receives requests from Dialogflow and returns formatted responses
 * Demonstrates: Webhook integration, intent handling, parameter extraction, dynamic responses
 */

const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are TravelMate, an intelligent travel assistant chatbot for AIML102 Conversational AI.

You handle these intents:
- Default Welcome Intent: greet warmly and introduce yourself
- BookTicket: help book flights or trains, ask for origin, destination, date
- BookHotel: help find hotels, ask for city, dates, guests
- CheckWeather: provide weather info for a destination
- PlanTrip: create itineraries and trip plans
- Default Fallback Intent: politely say you didn't understand and offer help
- SmallTalk: casual friendly conversation

Rules:
- Keep responses to 2-3 sentences maximum
- Be friendly and natural
- Always end your response on a new line with EXACTLY this format (valid JSON array):
CHIPS:["suggestion 1","suggestion 2","suggestion 3"]
- Make chips relevant to what was just discussed`;

// Dialogflow webhook endpoint
router.post('/', async (req, res) => {
  try {
    const { queryResult, session } = req.body;
    
    if (!queryResult) {
      return res.status(400).json({ error: 'Invalid Dialogflow request' });
    }

    const intentName = queryResult.intent?.displayName || 'Default Fallback Intent';
    const userMessage = queryResult.queryText || '';
    const parameters = queryResult.parameters || {};
    const sessionId = session?.split('/').pop() || 'unknown';

    console.log(`[Dialogflow] Intent: ${intentName}, Message: ${userMessage}`);

    // Generate AI response using Groq
    let reply = '';
    let chips = ['Book a Flight', 'Find Hotels', 'Plan a Trip'];

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Intent: ${intentName}\nParameters: ${JSON.stringify(parameters)}\nUser: ${userMessage}` 
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const raw = completion.choices[0]?.message?.content || '';
      const chipsMatch = raw.match(/CHIPS:(\[.*?\])/s);
      
      if (chipsMatch) {
        try { 
          chips = JSON.parse(chipsMatch[1]); 
        } catch(e) {
          console.error('Failed to parse chips:', e);
        }
        reply = raw.replace(/\nCHIPS:\[.*?\]/s, '').trim();
      } else {
        reply = raw;
      }
    } catch (err) {
      console.error('Groq error:', err.message);
      reply = "I'm having trouble connecting right now. Please try again in a moment!";
      chips = ['Book a Flight', 'Find Hotels', 'Check Weather'];
    }

    // Format response for Dialogflow
    const dialogflowResponse = {
      fulfillmentText: reply,
      fulfillmentMessages: [
        {
          text: {
            text: [reply]
          }
        },
        {
          payload: {
            chips: chips,
            intent: intentName,
            sessionId: sessionId
          }
        }
      ],
      source: 'travelmate-ai-webhook'
    };

    res.json(dialogflowResponse);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      fulfillmentText: "I encountered an error. Please try again!",
      source: 'travelmate-ai-webhook'
    });
  }
});

module.exports = router;
