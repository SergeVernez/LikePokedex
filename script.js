// --- On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM--
document.addEventListener("DOMContentLoaded", () => {
	// Sélectionne l'élément avec l'ID 'pokemonCard' et le stocke dans un conteneur (const) 'pokemonContainer' qui est à la foi une constante et un conteneur.
	const pokemonContainer = document.getElementById("pokemonCard");

	// --- Création d'un conteneur (const) pour la pagination---
	const paginationContainer = document.createElement("div"); // Crée un <div> pour afficher la pagination
	paginationContainer.classList.add("pagination"); // Ajoute la classe CSS 'pagination' a la div
	document.body.appendChild(paginationContainer); // ajoute la pagination en fin de page: "Mets la boîte de pagination à la fin de la grande boîte de contenu de la page."

	const POKEMON_PER_PAGE = 15; // Nombre de Pokémon par page à 15
	let currentPage = 1; // Définit la page actuelle. Donc affiche 15 pmokemons par page

	// --- Appel de l'API Pokémon ---
	function fetchPokemon(page) {
		// Calcule l'offset basé sur la page actuelle
		const offset = (page - 1) * POKEMON_PER_PAGE; // Formule pour calculer l'offset(offset est une variable utilisée pour dire combien d'éléments doivent être ignorés avant de commencer à récupérer les données): (page actuelle - 1) * nombre d'éléments par page

		// --- Utilise fetch pour une requête HTTP GET à l'API ---
		fetch("https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_PER_PAGE + "&offset=" + offset) // Méthode de concaténation. "&offset=" signifie : ET(&) à partir de ce point, ignore un certain nombre d'éléments. Une autre possibilité est l'utilisation de template literal, voir cours www.pierre-giraud.com:
			// fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`)
			.then((response) => response.json()) // Convertit la réponse en JSON (plus lisible dans la console au lieu de données brutes)
			.then((data) => {
				displayPokemonList(data.results); // Affiche la liste des Pokémon
				setupPagination(data.count, page); // Configure la pagination
			})
			.catch((error) => console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error));
	}

	// --- Fonction pour afficher la liste des Pokémon---
	function displayPokemonList(pokemons) {
		pokemonContainer.innerHTML = ""; // Efface les Pokémon précédents
		pokemons.forEach((pokemon) => {
			fetchPokemonData(pokemon); // Appelle fetchPokemonData pour chaque Pokémon
		});
	}

	// --- Fonction pour récupérer les données détaillées de chaque Pokémon--
	function fetchPokemonData(pokemon) {
		// Utilise fetch pour une requête HTTP GET à l'URL spécifique du Pokémon
		fetch(pokemon.url)
			.then((response) => response.json()) // Convertit la réponse en JSON
			.then((data) => {
				displayPokemon(data); // Appelle la fonction displayPokemon avec les données du Pokémon
			})
			.catch((error) => console.error("Erreur lors de la récupération des données du Pokémon:", error));
	}

	//  ----Fonction pour afficher les données du Pokémon---
	function displayPokemon(pokemon) {
		const pokemonCard = document.createElement("div");
		pokemonCard.classList.add("card");

		const pokemonImage = document.createElement("img");
		// Vérifie si l'image existe avant d'essayer de l'utiliser
		if (pokemon.sprites && pokemon.sprites.front_default) {
			pokemonImage.src = pokemon.sprites.front_default;
		} else {
			pokemonImage.src = "https://via.placeholder.com/150"; // Utilise une image de remplacement si l'image du pokemno n'est pas disponible
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
		const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE); //calcule combien de pages sont nécessaires pour afficher tous les Pokémon, en arrondissant à la page entière la plus proche pour être sûr d'inclure tous les Pokémon (https://www.w3schools.com/jsref/jsref_ceil.asp?form=MG0AV3 + aide de coplilot)
		paginationContainer.innerHTML = ""; // Efface les boutons de pagination précédents
		//--- Mise en place de la boucle for--
		for (let i = 1; i <= totalPages; i++) {
			//Je commence à la page 1 (i) et crée un bouton pour chaque page jusqu'à la dernière, en désactivant le bouton de la page actuelle et ajoutant un événement pour charger la page au clic.// <= totalPages correspond à tant que le numéro de page actuel (i) est inférieur ou égal au nombre total de pages (totalPages)
			const pageButton = document.createElement("button"); // PageButton pour créer un bouton pour la pagination
			pageButton.textContent = i; // Définit le texte du bouton comme le numéro de la page
			pageButton.disabled = i === currentPage; // désactive le bouton si c'est la page actuelle
			pageButton.addEventListener("click", () => fetchPokemon(i)); // Ajoute un événement de clic pour changer de page. Click avec addevenlistener et non onClick (meilleur pratique)
			paginationContainer.appendChild(pageButton); // /!\ajoute le bouton au conteneur de pagination dynamiquement car les boutton n'existent pas dans le HTML de base.
		}
	}

	fetchPokemon(currentPage); // Appelle la fonction fetchPokemon pour la première page
});

// --- explication sur le fetch API utilisé ici>> https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/
