// On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM
document.addEventListener("DOMContentLoaded", () => {
	// Sélectionne l'élément avec l'ID 'pokemonCard' et le stocke dans la constante 'pokemonContainer'
	const pokemonContainer = document.getElementById("pokemonCard");

	// --- Appel de l'API Pokémon ---
	function fetchPokemon() {
		// Utilise fetch pour une requête HTTP GET à l'API
		fetch("https://pokeapi.co/api/v2/pokemon?limit=15") // pour limiter à 15 Pokémon
			.then((response) => response.json()) // Convertit la réponse en JSON (plus lisible dans la console au lieu de données brutes)
			.then((data) => {
				data.results.forEach((pokemon) => {
					fetchPokemonData(pokemon); // Appelle fetchPokemonData pour chaque Pokémon
				});
			})
			.catch((error) => console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error));
	}

	// Fonction pour récupérer les données détaillées de chaque Pokémon
	function fetchPokemonData(pokemon) {
		// Utilise fetch pour une requête HTTP GET à l'URL spécifique du Pokémon
		fetch(pokemon.url)
			.then((response) => response.json()) // Convertit la réponse en JSON
			.then((data) => {
				displayPokemon(data); // Appelle la fonction displayPokemon avec les données du Pokémon
			})
			.catch((error) => console.error("Erreur lors de la récupération des données du Pokémon:", error));
	}

	// Fonction pour afficher les données du Pokémon
	function displayPokemon(pokemon) {
		const pokemonCard = document.createElement("div");
		pokemonCard.classList.add("card");

		const pokemonImage = document.createElement("img");
		// Vérifie si l'image existe avant d'essayer de l'utiliser
		if (pokemon.sprites && pokemon.sprites.front_default) {
			pokemonImage.src = pokemon.sprites.front_default;
		} else {
			pokemonImage.src = "https://via.placeholder.com/150"; // Utilise une image de remplacement
		}

		const pokemonName = document.createElement("h2");
		pokemonName.textContent = pokemon.name;

		const pokemonNumber = document.createElement("p");
		pokemonNumber.textContent = `#${pokemon.id}`; // Utilisation d'un template literal

		pokemonCard.appendChild(pokemonImage);
		pokemonCard.appendChild(pokemonName);
		pokemonCard.appendChild(pokemonNumber);

		pokemonContainer.appendChild(pokemonCard);
	}

	fetchPokemon(); // Appelle la fonction fetchPokemon
});

// explication sur le fetch API utilisé ici
// https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/