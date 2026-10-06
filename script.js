let offset = 0;
let limit = 20;
let loadedPokemon = [];                             //sets in der api das Limit und offset fest das es immer von 0 und 20 geht
let allPokemon = [];

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

let searchTimeout;


// Holt alle Pokemon-Namen für die Suche
async function loadPokemonNames() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
    let data = await response.json();

    allPokemon = data.results;
}



// und merkt sich danach die Pokemon, die angezeigt werden Lädt mit deiner Funktion 20 weitere Pokemon
async function loadMorePokemon() {
    await loadCharacters();
    saveLoadedPokemon();
}


// Merkt sich die Pokemon, die mit Lade mehr geladen wurden
function saveLoadedPokemon() {
    loadedPokemon = [];

    let cards = document.querySelectorAll('.poke-content');

    for (let i = 0; i < cards.length; i++) {
        let pokemon = {
            name: cards[i].querySelector('h3').innerText,
            image: cards[i].querySelector('img').src
        };

        loadedPokemon.push(pokemon);
    }
}


// Zeigt die bereits geladenen Pokemon wieder an
function showLoadedPokemon() {
    document.getElementById('allpokemon').innerHTML = '';

    for (let i = 0; i < loadedPokemon.length; i++) {
        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content">
                <img src="${loadedPokemon[i].image}">
                <h3>${loadedPokemon[i].name}</h3>
            </div>
        `;
    }
}


// Sucht auch nach Pokemon, die noch nicht geladen wurden
async function searchPokemon() {
    let searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    let loadMoreButton = document.getElementById('loadMore');

    if (searchText === '') {
        showLoadedPokemon();
        loadMoreButton.style.display = 'inline-block';
        return;
    }

    loadMoreButton.style.display = 'none';

    let matches = [];

    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].name.includes(searchText)) {
            matches.push(allPokemon[i]);
        }

        if (matches.length === 20) {
            break;
        }
    }

    document.getElementById('allpokemon').innerHTML = '';

    for (let i = 0; i < matches.length; i++) {
        let pokemonResponse = await fetch(matches[i].url);
        let pokemon = await pokemonResponse.json();

        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content">
                <img src="${pokemon.sprites.front_default}">
                <h3>${pokemon.name}</h3>
            </div>
        `;
    }
}


// Öffnet das große Pokemon-Fenster.
async function openPokemon(pokemonName) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    let pokemon = await response.json();

    let typeName = pokemon.types[0].type.name;

    document.getElementById('pokemonDetails').innerHTML = `
        <img class="big-pokemon-img" src="${pokemon.sprites.front_default}">
        <h2>${pokemon.name}</h2>
        <p>Pokedex Nummer: ${pokemon.id}</p>
        <p>Typ: ${typeName}</p>
        <p>Groesse: ${pokemon.height / 10} m</p>
        <p>Gewicht: ${pokemon.weight / 10} kg</p>
    `;

    document.getElementById('pokemonWindow').style.display = 'flex';
}


// Schließt das große Pokemon-Fenster
function closePokemon() {
    document.getElementById('pokemonWindow').style.display = 'none';
}

loadPokemonNames();
loadMorePokemon();

document.getElementById('loadMore').addEventListener('click', loadMorePokemon);

document.getElementById('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
        searchPokemon();
    }, 300);
});


document.getElementById('allpokemon').addEventListener('click', function (event) {
    let card = event.target.closest('.poke-content');

    if (card) {
        let pokemonName = card.querySelector('h3').innerText;
        openPokemon(pokemonName);
    }
});


document.getElementById('closeButton').addEventListener('click', closePokemon);


// Fenster schließen, wenn man auf den dunklen Hintergrund klickt
document.getElementById('pokemonWindow').addEventListener('click', function (event) {
    if (event.target.id == 'pokemonWindow') {
        closePokemon();
    }
});

async function searchPokemon() {
    let search = document.getElementById('searchInput').value.toLowerCase();
    let foundPokemon = [];

    if (search == '') {
        document.getElementById('allpokemon').innerHTML = '';

        for (let i = 0; i < loadedPokemon.length; i++) {
            showPokemon(loadedPokemon[i]);
        }

        return;
    }

    document.getElementById('loader').style.display = 'flex';

    for (let i = 0; i < allPokemon.length; i++) {
        if (allPokemon[i].name.includes(search)) {
            let response = await fetch(allPokemon[i].url);
            let pokemon = await response.json();

            foundPokemon.push(pokemon);
        }

        if (foundPokemon.length == 20) {
            break;
        }
    }

    document.getElementById('allpokemon').innerHTML = '';

    for (let i = 0; i < foundPokemon.length; i++) {
        showPokemon(foundPokemon[i]);
    }

    document.getElementById('loader').style.display = 'none';
}