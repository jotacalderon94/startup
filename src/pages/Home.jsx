import React, { useState } from 'react';

export default function Home() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!pokemonName.trim()) return;

    setLoading(true);
    setError('');
    setPokemonData(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!res.ok) throw new Error('Pokémon not found');
      const data = await res.json();
      setPokemonData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      {/* Application Data */}
      <section id="app-data">
        <h2>Application Data</h2>
      </section>

      {/* Third-Party API Section */}
      <section id="third-party">
        <h2>Pokémon Search</h2>
        <form id="pokemon-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="pokemon-input"
            placeholder="Enter Pokémon name"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div id="pokemon-result">
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {pokemonData && (
            <div>
              <h3>{pokemonData.name.toUpperCase()}</h3>
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                width="150"
              />
              <p>Height: {pokemonData.height}</p>
              <p>Weight: {pokemonData.weight}</p>
              <p>Base experience: {pokemonData.base_experience}</p>
            </div>
          )}
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

      {/* WebSocket Data (mocked for now) */}
      <section id="realtime">
        <h2>Friends</h2>
        <p>Matt M. <span className="status">Online</span></p>
        <p>Chase O. <span className="status2">Offline</span></p>
        <p>Ethan M. <span className="status">Online</span></p>
      </section>
    </main>
  );
}
