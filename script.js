// --- On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM--
document.addEventListener("DOMContentLoaded", () => {
	// Sélectionne l'élément avec l'ID 'pokemonCard' et le stocke dans un conteneur (const) 'pokemonContainer' qui est à la fois une constante et un conteneur.
	const pokemonContainer = document.getElementById("pokemonCard");
	
	//----Ajout de la fonction de recherche ----
	const searchInput = document.getElementById("searchInput");
	//Ajout de l'écouteur d'évenement de la fonction recherche
	searchInput.addEventListener('input', function(event) {
		const query = event.target.value.trim().toLowerCase();
		pokemonContainer.innerHTML = ''; //efface les resultats précedents
		if (query.length >= 3) {
			const filterData = data.filter(item => item.nom.toLowercase().includes(query));

			displayPokemonList(filterData)
		}
	})

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
			const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + POKEMON_PER_PAGE + "&offset=" + offset + "&language=fr_FR");
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
			// Récupèrer les données de chaque Pokémon de manière asynchrone et les trie dans l'orgdre par leur ID
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

	//--- Avant modif
	// function displayPokemon(pokemon) {
	// 	const pokemonCard = document.createElement("div");
	// 	pokemonCard.classList.add("card");

	//--- Après modif
	function displayPokemon(pokemon) {
		const pokemonCard = document.createElement("div");
		pokemonCard.classList.add("card");
		pokemonCard.addEventListener("click", () => {
			window.location.href = "./pages/info.html?pokemon=" + pokemon.name; // Redirige vers la page info.html avec le nom du Pokémon en paramètre dans l'URL
		});

		const pokemonImage = document.createElement("img");
		// Vérifie si l'image existe avant d'essayer de l'utiliser
		if (pokemon.sprites && pokemon.sprites.front_default) {
			pokemonImage.src = pokemon.sprites.front_default;
		} else {
			pokemonImage.src = "https://i.etsystatic.com/35671617/r/il/b962df/4227497410/il_570xN.4227497410_qclf.jpg"; // Autrement, utilise une image de remplacement si l'image du Pokémon n'est pas disponible
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

	// --- Mise en place de la pagination---
	// La pagination est faite comme ceci: flèche precédente, affichage page -1, page actuelle, page suivante, dérnière page, fléche suivante (tuto https://www.youtube.com/watch?app=desktop&v=WY5X2PpuwqA&t=44s + copilot)
	function setupPagination(totalCount, currentPage) {
		const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE); // La méthode Math.ceil() est utilisée pour arrondir un nombre à l'entier supérieur le plus proche. Calcule combien de pages sont nécessaires pour afficher tous les Pokémon, en arrondissant à la page entière la plus proche pour être sûr d'inclure tous les Pokémon (https://www.w3schools.com/jsref/jsref_ceil.asp?form=MG0AV3 + aide de copilot)
		paginationContainer.innerHTML = ""; // Efface les boutons de pagination précédents

		const createButton = (text, page) => {
			// Crée une constante 'createButton' et lui assigne une fonction fléchée: La fonction prend deux paramètres : 'text' (le caractère du bouton: 1,2,3,...) et 'page' (le numéro de la page associée au caractère du bouton: page 1 au caractère 1, etc...)

			const button = document.createElement("button");
			// Crée un nouvel élément HTML <button> et l'assigne à la constante 'button'

			button.textContent = text;
			// Définit le texte du bouton en utilisant la valeur du paramètre 'text'

			if (page === currentPage) {
				// vérifie si la page correspont à page actuelle
				button.disabled = true;
				// Alors, désactive le bouton pour empêcher l'utilisateur de cliquer dessus
			} else {
				// Sinon, exécute ceci:
				button.addEventListener("click", () => fetchPokemon(page));
				// Ajoute un écouteur d'événements au bouton pour écouter les clics lorsqu'on clique sur le bouton, la fonction fetchPokemon est appelée avec le numéro de page correspondant. On charge les données de la page désirée.
			}

			return button;
			// On return pour permettre l'utilisation du boutton qui vient d'^tre créer
		};

		// Flèche Précédente
		if (currentPage > 1) {
			const prevButton = createButton("«", currentPage - 1);
			paginationContainer.appendChild(prevButton);
		}
		// Si la page actuelle (currentPage) est supérieure à 1, crée un bouton "«" pour aller à la page précédente et l'ajoute au conteneur de pagination(paginationContainer). Puis il agit avec la fonction du bouton créé au dessus (dans ce cas lorsqu'il est cliqué il nous renvoi à la page précedente)

		// Première Page
		if (currentPage > 1) {
			const firstButton = createButton("1", 1);
			paginationContainer.appendChild(firstButton);
		}
		// Si la page actuelle (currentPage) est supérieure à 1, crée un bouton "1" pour aller à la première page et l'ajouter au conteneur de pagination. Le bouton charge la première page lorsqu'il est cliqué.

		// Page Précédente
		if (currentPage > 2) {
			const prevPageButton = createButton(currentPage - 1, currentPage - 1);
			paginationContainer.appendChild(prevPageButton);
		}
		// Si la page actuelle est supérieure à 2, crée un bouton pour aller à la page précédente (avec le numéro de page affiché) et l'ajoute au conteneur de pagination. Le bouton charge alors la page précédente lorsqu'il est cliqué. La répétition de (currentPage - 1) est nécessaire. Chaque utilisation de (`)currentPage - 1) a une fonction différente : l'une sert à définir le texte affiché sur le bouton et l'autre à indiquer la page qui doit être chargée quand on clique sur ce bouton (currentPage - 1 définit l'action à mener, par exemple aller à la page 2, et currentPage - 1 définit la page où aller, par exemple la page 1).

		// Page Actuelle
		const currentPageButton = createButton(currentPage, currentPage);
		paginationContainer.appendChild(currentPageButton);
		// Crée un bouton pour la page actuelle et l'ajoute au conteneur de pagination. Ce bouton est désactivé car il représente la page actuelle (defini dans la fonction).

		// Page Suivante
		if (currentPage < totalPages - 1) {
			const nextPageButton = createButton(currentPage + 1, currentPage + 1);
			paginationContainer.appendChild(nextPageButton);
			// Si la page actuelle est inférieure au nombre total de pages moins 1(totalPages - 1), crée un bouton pour aller à la page suivante (currentPage + 1) et on l'ajoute au conteneur de pagination. Le bouton charge la page suivante lorsqu'il est cliqué.
		}

		// Dernière Page
		if (currentPage < totalPages) {
			const lastButton = createButton(totalPages, totalPages);
			paginationContainer.appendChild(lastButton);
		}
		// Si la page actuelle est inférieure au nombre total de pages (currentPage < totalPages), crée un bouton pour aller à la dernière page puis l'ajoute au conteneur de pagination. Le bouton charge la dernière page lorsqu'il est cliqué.

		// Flèche Suivante
		if (currentPage < totalPages) {
			const nextButton = createButton("»", currentPage + 1);
			paginationContainer.appendChild(nextButton);
		}
		// Si la page actuelle est inférieure au nombre total de pages, crée un bouton "»" pour aller à la page suivante et l'ajoute au conteneur de pagination. Le bouton charge la page suivante lorsqu'il est cliqué.
	}
	// les noms des variables: prevButton, firstButton, prevPageButton, etc sont utiliser pour une bonne compréhension dans le code. J'aurai tout aussi bien pu utiliser tata, toto, tonton, etc pour les nomer.

	fetchPokemon(currentPage); // Appelle la fonction fetchPokemon pour la première page
});

// --- explication sur le fetch API utilisé ici>> https://www.pierre-giraud.com/javascript-apprendre-coder-cours/api-fetch/
