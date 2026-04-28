# Deploy TravelMate Backend to Render.com

## Step 1: Push to GitHub

1. Create a new repository on GitHub: https://github.com/new
   - Name: `travelmate-ai-backend`
   - Make it Public
   - Don't initialize with README

2. Run these commands in your terminal:
```bash
cd travelmate-backend
git remote add origin https://github.com/YOUR_USERNAME/travelmate-ai-backend.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render.com

1. Go to https://render.com and sign up/login (can use GitHub account)

2. Click "New +" → "Web Service"

3. Connect your GitHub repository: `travelmate-ai-backend`

4. Configure the service:
   - **Name**: `travelmate-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Add Environment Variable:
   - Click "Advanced" → "Add Environment Variable"
   - **Key**: `GROQ_API_KEY`
   - **Value**: `your_groq_api_key_here` (get from https://console.groq.com)

6. Click "Create Web Service"

7. Wait for deployment (2-3 minutes)

8. Your backend URL will be: `https://travelmate-ai-backend.onrender.com`

## Step 3: Test the Deployment

Once deployed, test these endpoints:
- Health: https://travelmate-ai-backend.onrender.com/health
- Fulfillment: POST to https://travelmate-ai-backend.onrender.com/fulfillment

Save your Render URL - you'll need it for the frontend!
