const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';
const DB = require ('./database.js');

app.use(express.json());
app.use(cookieParser());

// Serve static frontend *after deployment*
app.use(express.static('public'));

// ----------------------
// API Router
// ----------------------
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Helper to set auth cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production', // I dont have two environments but I want to keep it secure so later I can change it.
    httpOnly: true,
    sameSite: 'strict',
  });
}
// Create Account
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ msg: 'Missing fields' });

  const existing = await DB.getUser(email);
  if (existing) return res.status(409).send({ msg: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4(), totalPoints: 0, streak: 0 };
  await DB.addUser(user);
  await DB.updateUser(user);

  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

// Login
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await DB.getUser(email);
  if (!user) return res.status(401).send({ msg: 'Invalid login' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).send({ msg: 'Invalid login' });

  user.token = uuid.v4();
  await DB.updateUser(user);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);
  if (user) {
    delete user.token;
    await DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ----------------------
//  TASKS ENDPOINTS
// ----------------------
apiRouter.post('/tasks/create', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const { description, points } = req.body;
  if (!description || !points) {
    res.status(400).send({ msg: 'Missing fields' });
    return;
  }

  // logic to restrict daily tasks and points
  const today = new Date().toISOString().split('T')[0];
  const userTasks = await DB.getTasksByUser(user.email);
  const todayTasks = userTasks.filter(t => t.date === today);

  const totalPointsToday = todayTasks.reduce((sum, t) => sum + t.points, 0);
  if (todayTasks.length >= 10 || totalPointsToday + points > 20) {
    res.status(400).send({ msg: 'Daily limit reached (10 tasks / 20 pts max)' });
    return;
  }

  const newTask = {
    userEmail: user.email,
    description,
    points,
    isCompleted: false,
    date: today,
  };

  await DB.addTask(newTask);
  res.send({ msg: 'Task added', task: newTask });
});

apiRouter.get('/tasks/daily', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const tasks = await DB.getTasksByUser(user.email);
  const today = new Date().toISOString().split('T')[0];
   res.send(tasks.filter(t => t.date === today && !t.isCompleted));
});

apiRouter.put('/tasks/complete/:description', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const { description } = req.params;
  const tasks = await DB.getTasksByUser(user.email);
  const task = tasks.find((t) => t.description === description);

  if (!task) {
    res.status(404).send({ msg: 'Task not found' });
    return;
  }

  // 🔹 Update the task in the database
  await DB.updateTaskCompletion(user.email, description);

  // 🔹 Update the user's total points
  user.totalPoints = (user.totalPoints || 0) + task.points;
  await DB.updateUser(user);

  res.send({
    msg: 'Task completed and saved',
    newTotalPoints: user.totalPoints,
  });
});

// ----------------------
// 🐉 POKÉMON ENDPOINTS
// ----------------------
apiRouter.get('/pokemon/starter', async (req, res) => {
  const starters = [
    { name: 'Charmander', hp: 50 },
    { name: 'Squirtle', hp: 55 },
    { name: 'Bulbasaur', hp: 60 },
  ];
  res.send(starters);
});

apiRouter.post('/pokemon/select', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);

  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const { name, hp } = req.body;
  const pokemon = { name, hp, owner: user.email };

  await DB.addPokemon(pokemon);

  user.currentPokemon = name;
  await DB.updateUser(user);

  res.send({ msg: `${name} selected as starter!`, pokemon });
});

apiRouter.get('/pokemon/collection', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const collection = await DB.getUserPokemon(user.email);
  res.send(collection);
});



// protected endpoint example
apiRouter.get('/protected', async (req, res) => {
  const token = req.cookies[authCookieName];
  const user = await DB.getUserByToken(token);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });
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
