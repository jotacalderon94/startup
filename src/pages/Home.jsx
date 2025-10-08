import React from 'react'

export default function Home() {
  return (
    <main className="container">
      {/* Application Data */}
    <section id="app-data">
      <h2>Application Data</h2>
    </section>
    <section id="third-party">
      <h2>Pokemon Search</h2>
      <form id="pokemon-form">
        <input type="text" id="pokemon-input" placeholder="Enter Pokémon name" />
        <button type="submit">Search</button>
      </form>
      <div id="pokemon-result">
        <p>Pokémon data will appear here</p>
      </div>
    </section>

    {/* Database Data */}
    <section id="db-data">
      <h2>Tasks</h2>
      <ul>
        <li>Task 1: Sleep 7 hours</li>
        <li>Task 2: Exercise for 30 minutes</li>
        <li>Task 3: Read a book for 1 hour</li>
      </ul>
    </section>

    {/* WebSocket Data */}
    <section id="realtime">
      <h2>Friends</h2>
      <p>Matt M. <span class="status">Online</span></p>
      <p>Chase O. <span class="status2">Offline</span></p>
      <p>Ethan M. <span class="status">Online</span></p>
    </section>
      
    </main>
  )
}
