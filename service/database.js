const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// Mongo connection string (igual al estilo Simon)
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('habitbuddy'); // 💡 Tu base real
const usersCollection = db.collection('users');
const taskCollection = db.collection('task');
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

// Login-user related DB functions
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
// Task-related DB functions

async function addTask(task) {
  await taskCollection.insertOne(task);
}

async function getTasksByUser(email) {
  const cursor = taskCollection.find({ userEmail: email });
  return cursor.toArray();
}

async function updateTask(task) {
  await taskCollection.updateOne(
    { userEmail: task.userEmail, description: task.description },
    { $set: task }
  );
}

async function updateTaskCompletion(email, description) {
  await taskCollection.updateOne(
    { userEmail: email, description },
    { $set: { isCompleted: true } }
  );
}
async function deleteTask(description, email) {
  await taskCollection.deleteOne({ description: description, userEmail: email });
}
// Pokémon-related DB functions
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
  updateTask,
  updateTaskCompletion,
  deleteTask,
  addPokemon,
  getUserPokemon,
};
