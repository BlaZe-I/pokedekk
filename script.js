let offset = 0;
let limit = 20;                                //sets in der api das Limit und offset fest das es immer von 0 und 20 geht

async function loadCharacters() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);                 //hier greift es auf Let zu und fängt vom ersten Pokemon an zu zählen und zählt 20 mal weiter
    let characters = await response.json();

    for (let i = 0; i < characters.results.length; i++) {

        let pokemonResponse = await fetch(characters.results[i].url);
        let pokemon = await pokemonResponse.json();

        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content">
                <img src="${pokemon.sprites.front_default}">
                <h3>${pokemon.name}</h3>
                
            </div>
        `;
    }
    offset += limit;                                          //hier wird gesagt das offset + Limit gerechnet werden heißt immer plus 20 mehr
}

loadCharacters();

document.getElementById('loadMore').addEventListener('click',loadCharacters)               // hier wird ausgeführt das dder button ein event kriegt und demnach 20 weiter bei loadCharacters rendert


function showPokemon(pokemonList) {
    document.getElementById('allpokemon').innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content" onclick="openPokemon(${pokemonList[i].id})">
                <img src="${pokemonList[i].sprites.front_default}">
                <h3>${pokemonList[i].name}</h3>
            </div>
        `;
    }
}


                                                                                           // Suchleiste
function searchPokemon() {
    let searchText = document.getElementById('searchInput').value.toLowerCase();
    let foundPokemon = [];

    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].name.includes(searchText)) {
            foundPokemon.push(allPokemon[i]);
        }
    }

    showPokemon(foundPokemon);
}


                                                                                                    // Grosses Pokemon Fenster öffnen
function openPokemon(pokemonId) {
    let selectedPokemon;

    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].id == pokemonId) {
            selectedPokemon = allPokemon[i];
        }
    }

    if (selectedPokemon) {
        let typeName = selectedPokemon.types[0].type.name;

        document.getElementById('pokemonDetails').innerHTML = `
            <img class="big-pokemon-img" src="${selectedPokemon.sprites.front_default}">
            <h2>${selectedPokemon.name}</h2>
            <p>Pokedex Nummer: ${selectedPokemon.id}</p>
            <p>Typ: ${typeName}</p>
            <p>Groesse: ${selectedPokemon.height / 10} m</p>
            <p>Gewicht: ${selectedPokemon.weight / 10} kg</p>
        `;

        document.getElementById('pokemonWindow').style.display = 'flex';
    }
}


                                                                                                          // Grosses Fenster schliessen
function closePokemon() {
    document.getElementById('pokemonWindow').style.display = 'none';
}


document.getElementById('loadMore').addEventListener('click', loadCharacters);
document.getElementById('searchInput').addEventListener('input', searchPokemon);
document.getElementById('closeButton').addEventListener('click', closePokemon);


                                                                                            // Fenster schliessen wenn man auf den Hintergrund klickt
document.getElementById('pokemonWindow').addEventListener('click', function(event) {
    if (event.target.id == 'pokemonWindow') {
        closePokemon();
    }
});
