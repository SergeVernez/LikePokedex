// --- On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM ---
document.addEventListener("DOMContentLoaded", () => {
	const pokemonInfo = document.getElementById("infoCard");

	// Crée un objet URLSearchParams pour extraire les paramètres de l'URL de la page
	const urlParams = new URLSearchParams(window.location.search);

	// Récupère la valeur du paramètre 'pokemon' dans l'URL. Par exemple, pour 'info.html?pokemon=charizard', pokemonName sera 'charizard'
	const pokemonName = urlParams.get("pokemon");

	// Vérifie si un nom de Pokémon a été trouvé dans les paramètres de l'URL
	if (pokemonName) {
		// Appelle la fonction fetchPokemonDetails avec le nom du Pokémon pour récupérer ses détails depuis l'API
		fetchPokemonDetails(pokemonName);
	}

	// --- Appel à l'API Pokémon ---
	async function fetchPokemonDetails(name) {
		try {
			// Utilise la concaténation de chaînes pour construire l'URL de l'API avec le nom du Pokémon
			const url = "https://pokeapi.co/api/v2/pokemon/" + name;
			const response = await fetch(url);
			const data = await response.json();

			console.log(data);
		} catch (error) {
			console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error);
		}
	}
});
