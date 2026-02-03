# Deploying React App

This guide provides step-by-step instructions for deploying the full-stack React application (with Node.js backend) on two platforms: Render and Vercel. Each section includes simple steps, files to modify, and important notes.

## Deployment on Render

### Summary:
Deploy the backend as a web service on Render, which builds the frontend and serves both backend API and static frontend files.

### Steps:
1. Prepare the backend:
   - Ensure the backend is ready for production.

2. Create a new Web Service on Render:
   - Go to Render dashboard and create a new Web Service.
   - Connect your GitHub repository.
   - Set the Root Directory to `backend/`.
   - Set the Build Command to: `npm install; npm run build`
   - Set the Start Command to: `node src/server.js`

3. Deploy:
   - Render will automatically build and deploy your backend app.

### Files to Modify:
1. `server.js`: Add code to serve static files & handle SPA routing:
   ```
   const path = require('path');
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));
   app.use((req, res) => res.sendFile(path.join(__dirname, '../../frontend/dist/index.html')));
   ```
2. `package.json` in backend: Add build script: `"build": "cd ../frontend && npm install && npm run build"`
3. Add env vars in Render dashboard & ensure .env file locally.


## Deployment on Vercel

### Summary:
Deploy the full-stack app on Vercel using vercel.json for configuration, handling both backend and frontend builds.

### Steps:
1. Deploy:
   - Run `vercel` in the root directory.
   - Follow the prompts to link your project and deploy.

2. Alternative: Via GitHub:
   - Connect your GitHub repo to Vercel.
   - Vercel auto-detects React apps and deploys them.

### Files to Modify:
1. Add `vercel.json` in root:
   ```json
   {
     "version": 2,
     "builds": [
       {"src": "backend/src/server.js", "use": "@vercel/node"},
       {"src": "frontend/package.json", "use": "@vercel/static-build"}
     ],
     "rewrites": [
       {"source": "/api/(.*)", "destination": "backend/src/server.js"},
       {"source": "/(.*)", "destination": "/frontend/$1"}
     ]
   }
   ```
2. Ensure `package.json` in frontend has build script.
3. Add env vars in Vercel dashboard & ensure .env file locally.
