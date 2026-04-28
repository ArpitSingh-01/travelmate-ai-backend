# Dialogflow Integration Setup Guide

## Overview
This guide explains how to integrate TravelMate AI with Google Dialogflow for professional NLU (Natural Language Understanding) capabilities.

---

## 🎯 Why Dialogflow?

Dialogflow provides:
- **Advanced NLU**: Better intent detection than keyword matching
- **Entity Extraction**: Automatic extraction of cities, dates, numbers
- **Multi-language Support**: Support for 30+ languages
- **Context Management**: Conversation context tracking
- **Training**: ML-based intent classification
- **Industry Standard**: Used by Google Assistant, enterprise chatbots

---

## 📋 Prerequisites

1. Google Cloud account (free tier available)
2. Dialogflow ES (Essentials) agent
3. Backend deployed on Render.com

---

## 🚀 Step-by-Step Setup

### Step 1: Create Dialogflow Agent

1. Go to https://dialogflow.cloud.google.com/
2. Click "Create Agent"
3. Configure:
   - **Agent name**: `TravelMate-AI`
   - **Default language**: English
   - **Default time zone**: (Asia/Kolkata)
   - **Google Project**: Create new or select existing

### Step 2: Import Intents

You have two options:

#### Option A: Manual Creation (Recommended for Learning)

Create each intent manually in Dialogflow console:

**1. Default Welcome Intent** (Already exists)
- Enable webhook fulfillment
- Training phrases already provided

**2. BookTicket Intent**
- Click "Create Intent"
- Name: `BookTicket`
- Training Phrases:
  ```
  book a flight to Delhi
  I want to book a ticket
  book train from Mumbai to Pune
  reserve a flight
  I need to travel to Bangalore
  book bus ticket
  ```
- Parameters:
  - `destination` (type: @sys.geo-city)
  - `origin` (type: @sys.geo-city)
  - `date` (type: @sys.date)
- Enable "Webhook call for this intent"

**3. BookHotel Intent**
- Name: `BookHotel`
- Training Phrases:
  ```
  find hotels in Goa
  book a hotel
  I need accommodation in Mumbai
  looking for a room
  find me a hotel
  where can I stay in Delhi
  ```
- Parameters:
  - `city` (type: @sys.geo-city)
  - `checkin` (type: @sys.date)
  - `checkout` (type: @sys.date)
- Enable webhook

**4. CheckWeather Intent**
- Name: `CheckWeather`
- Training Phrases:
  ```
  what's the weather in Mumbai
  check weather
  will it rain in Delhi
  temperature in Bangalore
  weather forecast
  is it sunny today
  ```
- Parameters:
  - `city` (type: @sys.geo-city)
- Enable webhook

**5. PlanTrip Intent**
- Name: `PlanTrip`
- Training Phrases:
  ```
  plan a trip to Kerala
  create an itinerary
  I want to visit Rajasthan
  plan my vacation
  suggest places to visit
  help me explore Goa
  ```
- Parameters:
  - `destination` (type: @sys.any)
  - `duration` (type: @sys.duration)
- Enable webhook

**6. Default Fallback Intent** (Already exists)
- Enable webhook fulfillment

#### Option B: Import from JSON (Faster)

1. Download intent JSON files from `dialogflow-config/intents/`
2. In Dialogflow console, go to each intent
3. Click the three dots (⋮) → "Export"
4. Then "Import" and upload the JSON files

### Step 3: Configure Webhook

1. In Dialogflow console, click "Fulfillment" (left sidebar)
2. Enable "Webhook"
3. Enter URL: `https://travelmate-ai-backend.onrender.com/dialogflow-webhook`
4. Click "Save"

### Step 4: Test in Dialogflow Console

1. Click "Try it now" in the right panel
2. Test queries:
   - "Hello" → Should trigger Default Welcome Intent
   - "Book a flight to Delhi" → Should trigger BookTicket
   - "Find hotels in Goa" → Should trigger BookHotel
   - "What's the weather in Mumbai?" → Should trigger CheckWeather
   - "Plan a trip to Kerala" → Should trigger PlanTrip

3. Check "Diagnostic Info" to see webhook responses

---

## 🔗 Integration Options

### Option 1: Dialogflow Web Integration (Easiest)

1. In Dialogflow console, click "Integrations"
2. Enable "Web Demo"
3. Copy the iframe code
4. Embed in your website

### Option 2: Dialogflow Messenger (Recommended)

1. In Dialogflow console, click "Integrations"
2. Enable "Dialogflow Messenger"
3. Copy the script tag
4. Add to your HTML:

```html
<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
<df-messenger
  chat-title="TravelMate AI"
  agent-id="YOUR_AGENT_ID"
  language-code="en"
></df-messenger>
```

### Option 3: Custom Frontend Integration (Current Setup)

Keep using the React frontend with local intent detection, but you can optionally:

1. Install Dialogflow SDK in frontend:
```bash
npm install @google-cloud/dialogflow
```

2. Update `frontend/src/utils/api.js` to call Dialogflow API directly
3. Or keep current setup (works without Dialogflow for demo purposes)

---

## 🧪 Testing the Integration

### Test Webhook Directly

```bash
curl -X POST https://travelmate-ai-backend.onrender.com/dialogflow-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "queryResult": {
      "queryText": "Book a flight to Delhi",
      "intent": {
        "displayName": "BookTicket"
      },
      "parameters": {
        "destination": "Delhi"
      }
    },
    "session": "projects/travelmate-ai/agent/sessions/test-123"
  }'
```

Expected response:
```json
{
  "fulfillmentText": "I'd be happy to help you book a flight to Delhi!...",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["I'd be happy to help you book a flight to Delhi!..."]
      }
    },
    {
      "payload": {
        "chips": ["Check Prices", "View Airlines", "Travel Tips"],
        "intent": "BookTicket",
        "sessionId": "test-123"
      }
    }
  ],
  "source": "travelmate-ai-webhook"
}
```

---

## 📊 Dialogflow vs Local Intent Detection

| Feature | Local (Current) | Dialogflow |
|---------|----------------|------------|
| **Setup** | ✅ No setup needed | ⚠️ Requires Google Cloud |
| **Accuracy** | ⚠️ Keyword-based | ✅ ML-based NLU |
| **Entities** | ❌ Manual parsing | ✅ Auto-extraction |
| **Training** | ❌ Hard-coded | ✅ Learns from examples |
| **Multi-language** | ❌ English only | ✅ 30+ languages |
| **Cost** | ✅ Free | ✅ Free tier (15k requests/month) |
| **Latency** | ✅ Instant | ⚠️ ~200-500ms |
| **AIML102 Demo** | ✅ Sufficient | ✅ Professional |

---

## 🎓 AIML102 Relevance

### Unit 2: Interaction Model
- **Agents**: Dialogflow agent = TravelMate AI
- **Intents**: 6 custom intents + 2 default
- **Training Phrases**: Multiple examples per intent
- **Entities**: System entities (@sys.geo-city, @sys.date)
- **Parameters**: Extracted from user input
- **Contexts**: Session-based conversation tracking

### Unit 4: Fulfillment
- **Webhook**: `/dialogflow-webhook` endpoint
- **Request Format**: Dialogflow webhook request
- **Response Format**: Dialogflow webhook response
- **Dynamic Responses**: Groq AI integration
- **Parameter Extraction**: From Dialogflow queryResult

---

## 🔐 Security Best Practices

1. **Webhook Authentication** (Optional but recommended):
   - Add authentication header in Dialogflow webhook settings
   - Verify header in backend

2. **HTTPS Only**: Dialogflow requires HTTPS (Render provides this)

3. **Rate Limiting**: Implement rate limiting in backend

4. **Input Validation**: Validate all parameters from Dialogflow

---

## 🐛 Troubleshooting

### Issue: Webhook not responding
**Solution**: 
- Check Render logs: https://dashboard.render.com
- Verify webhook URL is correct
- Test endpoint directly with curl

### Issue: Intent not detected
**Solution**:
- Add more training phrases
- Check for typos in training phrases
- Retrain agent (happens automatically)

### Issue: Parameters not extracted
**Solution**:
- Verify entity types are correct
- Check parameter names match in webhook
- Use @sys entities for common types

### Issue: Slow responses
**Solution**:
- Render free tier has cold starts (first request slow)
- Upgrade to paid tier for always-on instances
- Or keep frontend intent detection as fallback

---

## 📚 Additional Resources

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Webhook Format](https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook)
- [System Entities](https://cloud.google.com/dialogflow/es/docs/reference/system-entities)
- [Best Practices](https://cloud.google.com/dialogflow/es/docs/best-practices)

---

## 🎯 Deployment Checklist

- [ ] Create Dialogflow agent
- [ ] Import/create all intents
- [ ] Configure webhook URL
- [ ] Test in Dialogflow console
- [ ] Enable Dialogflow Messenger (optional)
- [ ] Test end-to-end with frontend
- [ ] Monitor webhook logs
- [ ] Document for AIML102 submission

---

## 💡 Pro Tips

1. **Start Simple**: Test with Default Welcome Intent first
2. **Use Diagnostic Info**: Check webhook request/response in Dialogflow
3. **Add More Training Phrases**: More examples = better accuracy
4. **Use Contexts**: For multi-turn conversations (advanced)
5. **Monitor Usage**: Check Dialogflow quotas in Google Cloud Console

---

**Note**: The current frontend works independently with local intent detection. Dialogflow integration is optional but recommended for production and demonstrates professional AIML102 implementation.
