const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// Mongo connection string (igual al estilo Simon)
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('habitbuddy'); // 💡 Tu base real
const usersCollection = db.collection('users');
const tasksCollection = db.collection('tasks');
const pokemonCollection = db.collection('pokemon');

// Test connection
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log('Connected to MongoDB HabitBuddy');
  } catch (err) {
    console.error('Mongo connection failed:', err.message);
    process.exit(1);
  }
})();

// Basic operations
function getUser(email) {
  return usersCollection.findOne({ email });
}

function getUserByToken(token) {
  return usersCollection.findOne({ token });
}

async function addUser(user) {
  await usersCollection.insertOne(user);
}

async function updateUser(user) {
  await usersCollection.updateOne({ email: user.email }, { $set: user });
}

async function addTask(task) {
  await tasksCollection.insertOne(task);
}

async function getTasksByUser(userEmail) {
  return tasksCollection.find({ userEmail }).toArray();
}

async function addPokemon(pokemon) {
  await pokemonCollection.insertOne(pokemon);
}

async function getUserPokemon(userEmail) {
  return pokemonCollection.find({ owner: userEmail }).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addTask,
  getTasksByUser,
  addPokemon,
  getUserPokemon,
};
