//adding the third party api logic 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pokemon-form");
  const input = document.getElementById("pokemon-input");
  const resultDiv = document.getElementById("pokemon-result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = input.value.trim().toLowerCase();
    if (!name) return;

    resultDiv.innerHTML = "<p>Loading...</p>";

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) {
        throw new Error("Pokémon not found");
      }

      const data = await res.json();

      resultDiv.innerHTML = `
        <h3>${data.name.toUpperCase()}</h3>
        <img src="${data.sprites.front_default}" alt="${data.name}" />
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
        <p>Base experience: ${data.base_experience}</p>
      `;
    } catch (err) {
      resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  });
});



console.log("Checking that it is loading. If you see this, it is working!");
