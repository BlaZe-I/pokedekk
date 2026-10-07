let offset = 0;
let limit = 20;
let loadedPokemon = [];                             //sets in der api das Limit und offset fest das es immer von 0 und 20 geht
let allPokemon = [];
let searchTimeout;


// Zeigt den Loadspinner an
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}


// Versteckt den Loadspinner
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}


async function loadCharacters() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);                 //hier greift es auf Let zu und fängt vom ersten Pokemon an zu zählen und zählt 20 mal weiter
    let characters = await response.json();

    for (let i = 0; i < characters.results.length; i++) {

        let pokemonResponse = await fetch(characters.results[i].url);
        let pokemon = await pokemonResponse.json();
        let typeName = pokemon.types[0].type.name;

        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content ${typeName}" data-type="${typeName}">
                <img src="${pokemon.sprites.front_default}">
                <h3>${pokemon.name}</h3>
            </div>
        `;
    }

    offset += limit;                                          //hier wird gesagt das offset + Limit gerechnet werden heißt immer plus 20 mehr
}


// Holt alle Pokemon-Namen für die Suche
async function loadPokemonNames() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
    let data = await response.json();

    allPokemon = data.results;
}


// Lädt 20 weitere Pokemon
async function loadMorePokemon() {
    showLoader();

    await loadCharacters();
    saveLoadedPokemon();

    hideLoader();
}


// Merkt sich die Pokemon, die mit Lade mehr geladen wurden
function saveLoadedPokemon() {
    loadedPokemon = [];

    let cards = document.querySelectorAll('.poke-content');

    for (let i = 0; i < cards.length; i++) {
        let pokemon = {
            name: cards[i].querySelector('h3').innerText,
            image: cards[i].querySelector('img').src,
            type: cards[i].dataset.type
        };

        loadedPokemon.push(pokemon);
    }
}


// Zeigt die bereits geladenen Pokemon wieder an
function showLoadedPokemon() {
    document.getElementById('allpokemon').innerHTML = '';

    for (let i = 0; i < loadedPokemon.length; i++) {
        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content ${loadedPokemon[i].type}" data-type="${loadedPokemon[i].type}">
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

    showLoader();
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
        let typeName = pokemon.types[0].type.name;

        document.getElementById('allpokemon').innerHTML += `
            <div class="poke-content ${typeName}" data-type="${typeName}">
                <img src="${pokemon.sprites.front_default}">
                <h3>${pokemon.name}</h3>
            </div>
        `;
    }

    hideLoader();
}


// Öffnet das große Pokemon-Fenster.
async function openPokemon(pokemonName) {
    showLoader();

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    let pokemon = await response.json();

    let typeName = pokemon.types[0].type.name;
    let pokemonWindowContent = document.querySelector('.pokemon-window-content');

    pokemonWindowContent.className = `pokemon-window-content ${typeName}`;

    document.getElementById('pokemonDetails').innerHTML = `
        <img class="big-pokemon-img" src="${pokemon.sprites.front_default}">
        <h2>${pokemon.name}</h2>
        <p>Pokedex Nummer: ${pokemon.id}</p>
        <p>Typ: ${typeName}</p>
        <p>Groesse: ${pokemon.height / 10} m</p>
        <p>Gewicht: ${pokemon.weight / 10} kg</p>
    `;

    hideLoader();
    document.getElementById('pokemonWindow').style.display = 'flex';
}


// Schließt das große Pokemon-Fenster
function closePokemon() {
    document.getElementById('pokemonWindow').style.display = 'none';
}


// Lädt beim Start erst alles fertig und blendet dann den Spinner aus
async function init() {
    showLoader();

    await loadPokemonNames();
    await loadCharacters();
    saveLoadedPokemon();

    hideLoader();
}


init();


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
