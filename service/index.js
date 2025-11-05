const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

// Serve static frontend *after deployment*
app.use(express.static('public'));

// Example endpoint (you'll replace with real logic soon)
app.get('/api/hello', (req, res) => {
  res.send({ msg: "Backend is running" });
});

// Fallback handler for unknown routes
app.use((req, res) => {
  res.status(404).send({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Startup backend running on port ${port}`);
});
