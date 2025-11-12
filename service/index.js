const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';

const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const DB = require ('./database.js')

// Simon-style connection string using separate keys
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);


(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }
})();

// Temporary in-memory users (replaced with DB later)
let users = [];

app.use(express.json());
app.use(cookieParser());

// Serve static frontend *after deployment*
app.use(express.static('public'));

// ----------------------
// API Router
// ----------------------
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Create Account
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  if (users.find(u => u.email === email)) {
    res.status(409).send({ msg: 'User already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const token = uuid.v4();

  users.push({ email, password: passwordHash, token });

  // Set cookie
  res.cookie(authCookieName, token, { httpOnly: true });
  res.send({ email });
});

// Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).send({ msg: 'Invalid login' });
    return;
  }

  user.token = uuid.v4();
  res.cookie(authCookieName, user.token, { httpOnly: true });
  res.send({ email });
});

// Logout
apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Example Protected Endpoint (optional test)
apiRouter.get('/protected', (req, res) => {
  const token = req.cookies[authCookieName];

  const user = users.find(u => u.token === token);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  res.send({ secret: `Hello ${user.email}, you are authenticated 🎉` });
});

// ----------------------
// Existing Test Endpoint 
// ----------------------
app.get('/api/hello', (req, res) => {
  res.send({ msg: "Backend is running" });
});

// ----------------------
// Fallback handler (kept as optional catch-all)
// ----------------------
app.use((req, res) => {
  res.status(404).send({ error: 'Not Found' });
});

// ----------------------
// Start server
// ----------------------
app.listen(port, () => {
  console.log(`✅ Startup backend running on port ${port}`);
});
