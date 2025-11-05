import React, { useState } from 'react';
import { usePokemon } from '../context/PokemonContext';

export default function Home() {
  const { pokemon, setPokemon } = usePokemon();

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
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!res.ok) throw new Error('Pokémon not found');

      const data = await res.json();

      // Keep only the data we actually need
      const partnerData = {
        name: data.name,
        sprite: data.sprites.other['showdown'].front_default ?? data.sprites.front_default,
        xp: 0,
        level: 1,
      };

      setPokemonData(partnerData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectPokemon() {
    if (pokemonData) {
      setPokemon(pokemonData);
    }
  }

  return (
    <main className="container">

      <section>
        <h2>Your Pokémon Partner</h2>

        {/* If partner already selected */}
        {pokemon && (
          <div className="pokemon-selected">
            <h3>{pokemon.name.toUpperCase()}</h3>
            <img src={pokemon.sprite} alt={pokemon.name} width="150" />
            <p>Level: {pokemon.level}</p>
            <p>XP: {pokemon.xp}</p>
          </div>
        )}
      </section>

      {/* Pokémon Search */}
      <section id="third-party">
        <h2>Search a Pokémon to set as your partner</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Pokémon name"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {pokemonData && (
          <div className="pokemon-preview">
            <h3>{pokemonData.name.toUpperCase()}</h3>
            <img src={pokemonData.sprite} alt={pokemonData.name} width="150" />
            <p><button onClick={selectPokemon}>Set as Partner</button></p>
          </div>
        )}
      </section>

      {/* Mock friends for now */}
      <section id="realtime">
        <h2>Friends</h2>
        <p>Matt M. <span className="status">Online</span></p>
        <p>Chase O. <span className="status2">Offline</span></p>
        <p>Ethan M. <span className="status">Online</span></p>
      </section>

    </main>
  );
}
