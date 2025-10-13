const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

// Serve static files with caching
app.use(express.static(distPath, { maxAge: '1d' }));

// Fallback to index.html for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Frontend server listening on port ${PORT}`));
