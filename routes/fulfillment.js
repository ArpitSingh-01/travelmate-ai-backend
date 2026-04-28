/** AIML102 Unit 2 — Interaction Model
 * Demonstrates: Agents, Intents (Default/Custom/Fallback), Training Phrases,
 * Entities, Slot Filling, Parameters
 * 
 * AIML102 Unit 4 — Fulfillment
 * Demonstrates: Webhook fulfillment, extracting parameter values,
 * structuring responses, cloud function pattern
 */

const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are TravelMate, an intelligent travel assistant chatbot built as a Dialogflow fulfillment webhook demonstration for AIML102 Conversational AI.

You handle these intents:
- Greeting: greet warmly
- BookTicket: help book flights or trains, ask for origin, destination, date (slot filling)
- BookHotel: help find hotels, ask for city, dates, guests
- CheckWeather: provide weather info for a destination
- PlanTrip: create itineraries and trip plans
- Farewell: say goodbye politely
- SmallTalk: casual friendly conversation (jokes, how are you, etc.)
- GeneralQuery: answer any other travel question

Rules:
- Keep responses to 2-3 sentences maximum
- Be friendly and natural (demonstrate small talk & salutations from Unit 2)
- Always end your response on a new line with EXACTLY this format (valid JSON array):
CHIPS:["suggestion 1","suggestion 2","suggestion 3"]
- Make chips relevant to what was just discussed`;

router.post('/', async (req, res) => {
  const { intentName = 'GeneralQuery', parameters = {}, userMessage, sessionId } = req.body;
  
  if (!userMessage) return res.status(400).json({ error: 'userMessage is required' });

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Intent: ${intentName}\nParameters: ${JSON.stringify(parameters)}\nUser: ${userMessage}` }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content || '';
    const chipsMatch = raw.match(/CHIPS:(\[.*?\])/s);
    
    let chips = ['Book a Flight', 'Find Hotels', 'Plan a Trip'];
    let reply = raw;
    
    if (chipsMatch) {
      try { chips = JSON.parse(chipsMatch[1]); } catch(e) {}
      reply = raw.replace(/\nCHIPS:\[.*?\]/s, '').trim();
    }

    res.json({ reply, chips, intent: intentName, sessionId, parameters });
  } catch (err) {
    console.error('Groq error:', err.message);
    res.json({
      reply: "I'm having trouble connecting right now. Please try again in a moment!",
      chips: ['Book a Flight', 'Find Hotels', 'Check Weather'],
      intent: intentName,
      sessionId
    });
  }
});

module.exports = router;
