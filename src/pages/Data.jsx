import React from 'react'

export default function Home() {
  return (
     <main className="container">
      <section>
        <h2>Tasks from Database</h2>

        <ul>
          <li>Task 1: Sleep 7 hours</li>
          <li>Task 2: Exercise for 30 minutes</li>
          <li>Task 3: Read a book for 1 hour</li>
        </ul>

        {/* Pokémon partner image */}
        <div id="pokemon-partner">
          <img src="/images/pokemonpartner.jpg" alt="Pokemon" />
        </div>

        {/* Add new task */}
        <div id="new-task">
          <input type="text" id="task-input" placeholder="New Task" />
          <button id="add-task">Add Task</button>
        </div>

        <h3>Score</h3>
        <p>Your score is 3 out of 3 tasks completed</p>
      </section>
    </main>
  )
}