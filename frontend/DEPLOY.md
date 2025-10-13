Frontend deploy checklist

1. Set environment variables on your host
   - VITE_API_URL should point to your deployed backend, e.g.:
     VITE_API_URL=https://soundbeatx-backend.onrender.com
   - Add other public keys as needed (Stripe publishable key, Cloudinary cloud name, etc.).

2. Ensure single-page-app routing works
   - For Render: add a _redirects file or use the static site configuration to forward all routes to /index.html.
   - For Netlify: include a `public/_redirects` with `/* /index.html 200` (already present in this repo).
   - For Vercel: ensure `rewrites` are configured to serve index.html for unknown routes.

3. After setting env vars, trigger a redeploy so the build picks up `VITE_API_URL`.

4. Verify
   - Visit your frontend URL and open devtools > Network.
   - Confirm API requests go to the deployed backend (not http://localhost:5010).
   - If you see CORS errors, ensure the backend has `FRONTEND_URL` set to your frontend origin.
