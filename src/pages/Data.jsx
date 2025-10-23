import React, { useState } from 'react';

export default function Data({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState('');

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, newTask]);
    setNewTask('');
  };

  // Remove one task
  const handleDeleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // Clear all tasks
  const handleClearAll = () => {
    setTasks([]);
  };

  return (
    <main className="container">
      <h2>Task Manager</h2>

      <ul>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{task}</span>
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

      {/* Add + Clear controls */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="border p-1 rounded"
        />
        <button
          onClick={handleAddTask}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={handleClearAll}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Clear All
        </button>
      </div>
    </main>
  );
}
