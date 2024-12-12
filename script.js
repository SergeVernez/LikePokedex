document.addEventListener("DOMContentLoaded", () => {
	const pokemonContainer = document.getElementById("pokemonCard");

	//--- Appel de l'API pokémon---
	function fetchPokemon() {
		fetch("https://pokeapi.co/api/v2/pokemon");
	}
});
