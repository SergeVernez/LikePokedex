// --- On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM--
document.addEventListener("DOMContentLoaded", () => {
	// Sélectionne l'élément avec l'ID 'pokemonCard' et le stocke dans un conteneur (const) 'pokemonContainer' qui est à la fois une constante et un conteneur.
	const pokemonContainer = document.getElementById("pokemonCard");

	// --- Création d'un conteneur (const) pour la pagination---
	const paginationContainer = document.createElement("div"); // Crée un <div> pour afficher la pagination
	paginationContainer.classList.add("pagination"); // Ajoute la classe CSS 'pagination' à la div
	document.body.appendChild(paginationContainer); // ajoute la pagination en fin de page: "Mets la boîte de pagination à la fin de la grande boîte de contenu de la page."

	const POKEMON_PER_PAGE = 15; // Nombre de Pokémon par page à 15
	let currentPage = 1; // Définit la page actuelle. Donc affiche 15 Pokémon par page

	// --- Appel de l'API Pokémon ---
	async function fetchPokemon(page) {
		// Calcule l'offset basé sur la page actuelle
		const offset = (page - 1) * POKEMON_PER_PAGE; // Formule pour calculer l'offset (offset est une variable utilisée pour dire combien d'éléments doivent être ignorés avant de commencer à récupérer les données): (page actuelle - 1) * nombre d'éléments par page

		try {
			// --- Utilise fetch pour une requête HTTP GET à l'API ---
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`); // Utilisation de template literal
			const data = await response.json(); // Convertit la réponse en JSON (plus lisible dans la console au lieu de données brutes)
			displayPokemonList(data.results); // Affiche la liste des Pokémon
			setupPagination(data.count, page); // Configure la pagination
		} catch (error) {
			console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error);
		}
	}

	// --- Fonction pour afficher la liste des Pokémon---
	async function displayPokemonList(pokemons) {
		pokemonContainer.innerHTML = ""; // Efface les Pokémon précédents

		try {
			// Récupèrer les données de chaque Pokémon de manière asynchrone et les trie par ID
			const sortedPokemons = await Promise.all(pokemons.map((pokemon) => fetchPokemonData(pokemon)));
			sortedPokemons.sort((a, b) => a.id - b.id); // Trie les Pokémon par ID
			sortedPokemons.forEach((pokemon) => displayPokemon(pokemon)); // Affiche chaque Pokémon trié
		} catch (error) {
			console.error("Il y a un problème camarade! Erreur lors de l'affichage des données des Pokémon", error);
		}
	}

	// --- Fonction pour récupérer les données détaillées de chaque Pokémon--
	async function fetchPokemonData(pokemon) {
		try {
			const response = await fetch(pokemon.url); // Utilise fetch pour une requête HTTP GET à l'URL spécifique du Pokémon
			const data = await response.json(); // Convertit la réponse en JSON
			return data; // Retourne les données du Pokémon pour être utilisé dans Promise.all
		} catch (error) {
			console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error);
		}
	}

	// ---- Fonction pour afficher les données du Pokémon---
	function displayPokemon(pokemon) {
		const pokemonCard = document.createElement("div");
		pokemonCard.classList.add("card");

		const pokemonImage = document.createElement("img");
		// Vérifie si l'image existe avant d'essayer de l'utiliser
		if (pokemon.sprites && pokemon.sprites.front_default) {
			pokemonImage.src = pokemon.sprites.front_default;
		} else {
			pokemonImage.src = "https://via.placeholder.com/150"; // Utilise une image de remplacement si l'image du Pokémon n'est pas disponible
		}

		const pokemonName = document.createElement("h2");
		pokemonName.textContent = pokemon.name;

		const pokemonNumber = document.createElement("p");
		pokemonNumber.textContent = `#${pokemon.id}`; // utilisation d'un template literal

		pokemonCard.appendChild(pokemonImage);
		pokemonCard.appendChild(pokemonName);
		pokemonCard.appendChild(pokemonNumber);

		pokemonContainer.appendChild(pokemonCard);
	}

	// --- Fonction pour configurer la pagination---
	function setupPagination(totalCount, currentPage) {
		const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE); // Calcule combien de pages sont nécessaires pour afficher tous les Pokémon, en arrondissant à la page entière la plus proche pour être sûr d'inclure tous les Pokémon (https://www.w3schools.com/jsref/jsref_ceil.asp?form=MG0AV3 + aide de copilot)
		paginationContainer.innerHTML = ""; // Efface les boutons de pagination précédents

		const createButton = (text, page) => {
			const button = document.createElement("button");
			button.textContent = text;
			if (page === currentPage) {
				button.disabled = true;
			} else {
				button.addEventListener("click", () => fetchPokemon(page));
			}
			return button;
		};

		// Flèche Précédente
		if (currentPage > 1) {
			const prevButton = createButton("«", currentPage - 1);
			paginationContainer.appendChild(prevButton);
		}

		// Première Page
		if (currentPage > 1) {
			const firstButton = createButton("1", 1);
			paginationContainer.appendChild(firstButton);
		}

		// Page Précédente
		if (currentPage > 2) {
			const prevPageButton = createButton(currentPage - 1, currentPage - 1);
			paginationContainer.appendChild(prevPageButton);
		}

		// Page Actuelle
		const currentPageButton = createButton(currentPage, currentPage);
		paginationContainer.appendChild(currentPageButton);

		// Page Suivante
		if (currentPage < totalPages - 1) {
			const nextPageButton = createButton(currentPage + 1, currentPage + 1);
			paginationContainer.appendChild(nextPageButton);
		}

		// Dernière Page
		if (currentPage < totalPages) {
			const lastButton = createButton(totalPages, totalPages);
			paginationContainer.appendChild(lastButton);
		}

		// Flèche Suivante
		if (currentPage < totalPages) {
			const nextButton = createButton("»", currentPage + 1);
			paginationContainer.appendChild(nextButton);
		}
	}

	fetchPokemon(currentPage); // Appelle la fonction fetchPokemon pour la première page
});

// --- explication sur le fetch API utilisé ici>> https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/
