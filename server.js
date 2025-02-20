const express = require('express');
const path = require('path');
const app = express();

// Set default charset for responses (similar to "charset utf-8")
app.use((req, res, next) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  next();
});

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

// Define the static file directory (adjust this to your equivalent directory)
const staticDir = path.join(__dirname, 'public');

// Serve static files with a custom index order
app.use(express.static(staticDir, {
  index: ['index.html', 'index.htm', 'hostingstart.html']
}));

// Custom error page for server errors (500, etc.)
// Ensure the 50x.html file is placed in a directory named "html" at the same level as this file.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'html', '50x.html'));
});

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});