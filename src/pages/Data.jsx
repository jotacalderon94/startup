import React, { useState, useEffect } from 'react';

export default function TaskManager() {
  //  State for the task list
  const [tasks, setTasks] = useState([
    'Sleep 7 hours',
    'Exercise for 30 minutes',
    'Read a book for 1 hour',
  ]);

  // State for the new task input
  const [newTask, setNewTask] = useState('');

  // Load saved tasks from localStorage (optional)
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (savedTasks.length > 0) setTasks(savedTasks);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  //  Add a new task
  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, newTask]);
    setNewTask('');
  };

  // Remove one task
  const handleDeleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
  };

  // Clear all tasks
  const handleClearAll = () => {
    setTasks([]);
  };

  return (
    <main className="container">
      <section>
        <h2>Your Daily Tasks</h2>

        {/* Task list */}
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>Task {index + 1}: {task}</span>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                 Erase
                </button>
              </li>
            ))
          ) : (
            <li>No tasks yet — add one below!</li>
          )}
        </ul>

        {/* Pokémon partner image */}
        <div id="pokemon-partner" className="my-4">
          <img src="/images/pokemonpartner.jpg" alt="Pokemon" />
        </div>

        {/* Add new task */}
        <div id="new-task" className="flex gap-2">
          <input
            type="text"
            id="task-input"
            placeholder="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            id="add-task"
            onClick={handleAddTask}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
          <button
            id="clear-all"
            onClick={handleClearAll}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Clear All
          </button>
        </div>

        <h3 className="mt-4">Score</h3>
        <p>Your score is {tasks.length} tasks available</p>
      </section>
    </main>
  );
}
