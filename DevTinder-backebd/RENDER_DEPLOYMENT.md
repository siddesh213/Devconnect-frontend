# DevTinder - Backend Deployment Configuration for Render

## Render.com Deployment Steps

1. **Create Account**
   - Go to https://render.com and sign up

2. **Connect GitHub**
   - Click "New +" > "Web Service"
   - Select your GitHub repository (DevTinder-backend)

3. **Configure Service**
   ```
   Name: devtinder-backend
   Runtime: Node
   Region: Choose closest to your users
   Branch: main
   Build Command: npm install
   Start Command: node src/app.js
   ```

4. **Add Environment Variables**
   In Render Dashboard, go to Environment:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/DevTinder
   FRONTEND_URL=https://yourdomain.vercel.app
   JWT_SECRET=your-strong-random-secret
   ```

5. **Deploy**
   - Click "Deploy"
   - Render will auto-deploy on GitHub push

6. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://devtinder-backend.onrender.com`
   - Use this for frontend VITE_BASE_URL

## Important Notes

- First deploy takes 2-3 minutes (spins up server)
- Render puts free services to sleep after 15 minutes of inactivity
- Upgrade to paid plan for 24/7 availability
- Setup monitoring for errors

## Environment Variables Needed

```
PORT=3001
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
FRONTEND_URL=<your-vercel-frontend-url>
JWT_SECRET=<strong-random-string>
```

## Testing Deployment

```bash
# Test health check
curl https://devtinder-backend.onrender.com/health

# Test API
curl https://devtinder-backend.onrender.com/profile/view
```
