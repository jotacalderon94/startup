import React, { useState, useEffect } from "react";

export default function Data() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [points, setPoints] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //  Load today's tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks/daily");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  }

  //  Add a new task (calls backend)
  async function handleAddTask() {
    if (!newTask.trim()) return;
    try {
      const res = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newTask, points: parseInt(points) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Failed to add task");
      }
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
      setPoints(1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  //  Mark task as completed
  async function handleComplete(description) {
    try {
      const res = await fetch(`/api/tasks/complete/${encodeURIComponent(description)}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to complete task");
      const data = await res.json();
      setTasks((prev) => prev.filter((t) => t.description !== description));
      console.log(data.msg);
    } catch (err) {
      console.error(err);
      setError("Error completing task");
    }
  }

  // Clear all (optional local cleanup)
  async function handleClearAll() {
    setTasks([]);
  }

  return (
    <main className="container">
      <h2>Task Manager</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center">
                <span
                  style={{
                    textDecoration: task.isCompleted ? "line-through" : "none",
                    color: task.isCompleted ? "gray" : "black",
                  }}
                >
                  {task.description} ({task.points} pts)
                </span>
                <div className="flex gap-2">
                  {!task.isCompleted && (
                    <button
                      onClick={() => handleComplete(task.description)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                       Done
                    </button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li>No tasks yet — add one below!</li>
          )}
        </ul>
      )}

      {/* Add new task */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="border p-1 rounded"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="border p-1 rounded w-20"
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
