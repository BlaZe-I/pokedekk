async function loadCharacters() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    let characters = await response.json();

    for (let i = 0; i < characters.results.length; i++) {

        let pokemonResponse = await fetch(characters.results[i].url);
        let pokemon = await pokemonResponse.json();

        document.getElementById('allPokemon').innerHTML += `
            <div class="poke-content">
                <img src="${pokemon.sprites.front_default}">
                <p>${pokemon.name}</p>
                <p>#${pokemon.id}</p>
            </div>
        `;
    }
}

loadCharacters();
