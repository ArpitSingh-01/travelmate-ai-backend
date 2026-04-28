/** TravelMate AI — AIML102 Conversational AI, DDUGU Gorakhpur
 * Unit 1: Conversational Design — conversational flows & scripts
 * Unit 2: Interaction Model — Intents, Entities via intentDetector
 * Unit 3: Linear/Non-linear Dialogue — session-based multi-turn chat
 * Unit 4: Fulfillment — webhook POST /fulfillment, dynamic Groq responses
 * Unit 5: Deployment — Heroku (backend), Vercel (frontend)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fulfillmentRouter = require('./routes/fulfillment');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', project: 'TravelMate AI - AIML102' }));

app.use('/fulfillment', fulfillmentRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`TravelMate backend running on port ${PORT}`));
