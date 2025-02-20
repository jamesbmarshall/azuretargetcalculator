const express = require('express');
const path = require('path');
const app = express();

// Redirect www requests to the non-www domain
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '');
    return res.redirect(301, `https://${newHost}${req.url}`);
  }
  next();
});

// Deny access to any .git directories
app.use((req, res, next) => {
  if (req.url.match(/^\/\.git/)) {
    return res.status(403).send('Access Denied');
  }
  next();
});

// Define the static file directory
const staticDir = path.join(__dirname, 'public');

// Serve static files (this will automatically set proper Content-Types)
app.use(express.static(staticDir, {
  index: ['index.php', 'index.html', 'index.htm', 'hostingstart.html']
}));

// Middleware for setting HTML-specific headers only for non-static responses.
// (This will run for any routes not handled by express.static.)
app.use((req, res, next) => {
  // Only set Content-Type to HTML if it hasn't been set already
  if (!res.get('Content-Type')) {
    res.set('Content-Type', 'text/html; charset=utf-8');
  }
  next();
});

// Custom error page for server errors (500, etc.)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'html', '50x.html'));
});

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});