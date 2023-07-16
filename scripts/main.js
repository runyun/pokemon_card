import { getPokemons } from "./pokemon_storycard.js";

getPokemons();

// set current year in footer
const currentDate = new Date();
document.querySelector('#year').textContent = currentDate.getFullYear();