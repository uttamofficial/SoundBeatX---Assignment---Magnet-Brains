import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

// Serve static files with caching
app.use(express.static(distPath, { maxAge: '1d' }));

// Runtime env endpoint (so we can change endpoints without rebuilding)
app.get('/env.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  const env = {
    VITE_API_URL: process.env.VITE_API_URL || process.env.FRONTEND_API_URL || '',
    VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY || '',
    VITE_STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
  };

  // runtime fetch patch: rewrite any requests targeting localhost:5010 to the runtime API URL
  const runtimeFetchPatch = `
    (function(){
      window.__env = ${JSON.stringify(env)};
      try{
        const api = window.__env.VITE_API_URL || '';
        if(!api) return;
        const orig = window.fetch.bind(window);
        window.fetch = function(input, init){
          try{
            if(typeof input === 'string'){
              if(input.indexOf('localhost:5010') !== -1){
                input = input.replace(/http:\/\/localhost:5010/g, api);
              } else if(input.startsWith('/api')){
                input = api.replace(/\/$/, '') + input;
              }
            } else if(input && input.url){
              if(input.url.indexOf('localhost:5010') !== -1){
                input = new Request(input.url.replace(/http:\/\/localhost:5010/g, api), input);
              } else if(input.url.startsWith('/api')){
                input = new Request(api.replace(/\/$/, '') + input.url, input);
              }
            }
          }catch(e){console.error('env fetch rewrite error', e)}
          return orig(input, init);
        };
      }catch(e){console.error('env init error', e)}
    })();
  `;

  res.send(runtimeFetchPatch);
});

// Fallback to index.html for client-side routes using a simple middleware
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  const indexPath = path.join(distPath, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) return next(err);
    // Inject env.js script before closing </head>
    if (data.indexOf('</head>') !== -1) {
      data = data.replace('</head>', '  <script src="/env.js"></script>\n</head>');
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
});

app.listen(PORT, () => console.log(`Frontend server listening on port ${PORT}`));
