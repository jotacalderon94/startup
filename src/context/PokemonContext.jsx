import React from "react";
import { createContext, useContext, useState } from "react";

// Create the context
const PokemonContext = createContext();

// Export a hook that lets component access Pokémon data
export function usePokemon() {
  return useContext(PokemonContext);
}

// Provider wrapper
export function PokemonProvider({ children }) {
  const [pokemon, setPokemon] = useState(null); // no Pokémon selected yet

  return (
    <PokemonContext.Provider value={{ pokemon, setPokemon }}>
      {children}
    </PokemonContext.Provider>
  );
}
