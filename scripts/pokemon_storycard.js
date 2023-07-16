
const defaultApiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const defaultSpeciesApiUrl = 'https://pokeapi.co/api/v2/pokemon-species/';

// show only the amount of record for a pokemon
const randomDescriptionAmount = 2;
// a variable for how many pokemon in one page
const showPokemonAmount = 3;

const totalPokemonAmount = 1010;

async function fetchData(url, id) {
    const response = await fetch(url + id);
    
    if(response.ok) {
        const jsonData = await response.json()
        return jsonData;
    }
}

export function getPokemons() {
    let pokemons = [];

    while (pokemons.length < showPokemonAmount) {
        const randomPokemon = Math.floor(Math.random() * totalPokemonAmount);

        if (!pokemons.includes(randomPokemon)) {
            pokemons.push(randomPokemon);
        }
    }

    pokemons.map(pokemonId => getPokemon(pokemonId));
}

async function getPokemon(id) {

    const pokemonSpeiciesInfo = await fetchData(defaultSpeciesApiUrl, id);

    if (pokemonSpeiciesInfo == undefined) {
        renderErrorMessage();
        return;
    }

    const name = pokemonSpeiciesInfo.name; 
    const englishDescriptions = getDescriptionInLanguage('en', pokemonSpeiciesInfo);
    const randomDescriptions = getLimitDescriptions(englishDescriptions);

    const pokemonInfo = await fetchData(defaultApiUrl, id);
    const pictureUrl = pokemonInfo.sprites.other['official-artwork'].front_default;

    renderCard({id: id, name: name, randomDescriptions: randomDescriptions, pictureUrl});
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function renderErrorMessage() {
    reset();
    const p = document.createElement('p');
    p.style.color = 'red';
    p.innerText = 'No Data.';
    document.getElementById('cards').append(p);

    hideLoading();
}

function getLimitDescriptions(descriptions) {
    
    if (descriptions.length < randomDescriptionAmount ) {
        return descriptions;
    }

    let randomDescription = [];

    while (randomDescription.length < randomDescriptionAmount) {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        const selectDescription = descriptions[randomIndex];
        const selectDescriptionText = descriptions[randomIndex][0];
        
        const filterData = randomDescription.filter(data => data[0].toUpperCase() == selectDescriptionText.toUpperCase());
        if (filterData.length == 0) {randomDescription.push(selectDescription);}
    }

    return randomDescription;
}

function getDescriptionInLanguage(language, info) {
    let result = info.flavor_text_entries
        .filter(data => data.language.name == language)
        .map(data => {
            const flavorText = data.flavor_text;
            const verionName = data.version.name;
            return [flavorText, verionName];
        });
    
    return result;
}


function renderCard(pokemon) {

    const article = document.createElement('article');

    const img = document.createElement('img');
    img.src = pokemon.pictureUrl;

    const name = document.createElement('h1');
    name.innerText = pokemon.name;
    
    const itemList = document.createElement('ul');
    pokemon.randomDescriptions.map(description => itemList.innerHTML += `<li> ${description[0]} <small>-- Game version: ${description[1]}</small></li>`);

    article.append(img);
    article.append(name);
    article.append(itemList);
    document.getElementById('cards').append(article);

    article.style.backgroundColor = getCardBackgroundColor();

    hideLoading();
}

function getCardBackgroundColor () {
    const min = 130;
    const max = 230;
    
    const red = Math.floor(Math.random() * (max - min + 1) + min);
    const green = Math.floor(Math.random() * (max - min + 1) + min);
    const blue = Math.floor(Math.random() * (max - min + 1) + min);
    return `rgb(${red}, ${green}, ${blue})`;
}

function reset() {
    showLoading();
    document.getElementById('cards').innerHTML = '';
}

document.getElementById('searchID').addEventListener('click', ()=>{
    reset();

    let pokemonID = document.getElementById('pokemonID').value.toLowerCase();
    if (pokemonID.replace(/\s/g, '') == '' ) {
        getPokemons();
    } else {
        getPokemon(pokemonID);
    }
})
