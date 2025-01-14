// --- On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM ---
document.addEventListener("DOMContentLoaded", () => {
	const pokemonInfo = document.getElementById("infoCard");

	// Crée un objet URLSearchParams pour extraire les paramètres de l'URL de la page
	const urlParams = new URLSearchParams(window.location.search);

	// Récupère la valeur du paramètre 'pokemon' dans l'URL. Par exemple, pour 'info.html?pokemon=charizard', pokemonName sera 'charizard'
	const pokemonName = urlParams.get("pokemon");

	const page = urlParams.get("page") || 1;

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
			displayPokemonInfo(data);
		} catch (error) {
			console.error("Il y a un problème camarade! Erreur lors de la récupération des données du Pokémon", error);
		}
	}
	function displayPokemonInfo(pokemon) {
		const pokemonInfoContainer = document.getElementById("infoCard");

		//configuration de l'element "h2"
		const pokemonNameElement = document.createElement("h2");
		pokemonNameElement.textContent = pokemon.name + " #" + pokemon.id;
		//configuration de l'element "img"
		const pokemonImageElement = document.createElement("img");
		pokemonImageElement.src = pokemon.sprites.front_default || "default-image-url"; // || opérateur logique OR en lieu et place de if et else pour les valeurs true
		//cofiguration de l'element "p"
		const pokemonTypesElement = document.createElement("h4");
		pokemonTypesElement.textContent =
			"TYPES : " +
			pokemon.types
				.map(function (type) {
					return type.type.name;
				})
				.join(", ");

		//Ajout des capacités du pokemon
		const pokemonAbilitiesElement = document.createElement("h5");
		pokemonAbilitiesElement.textContent =
			"CAPACITÉS : " +
			pokemon.abilities
				.map(function (ability) {
					return ability.ability.name;
				})
				.join(",");
		//Ajout d'autres details comme la hauteur du pokemon
		const pokemonHeightElement = document.createElement("h3");
		pokemonHeightElement.textContent = "HAUTEUR : " + pokemon.height / 10 + "m"; //: /10 dans ce contexte se réfère à la conversion des valeurs de height (hauteur) et weight (poids) des Pokémon en unités plus lisibles (m et kg)

		//Ajout du poid du pokmon
		const pokemonWeightElement = document.createElement("h3");
		pokemonWeightElement.textContent = "POID : " + pokemon.weight / 10 + "kg";

		// Ajoute les éléments créés au conteneur du détail du pokemon dans le DOM
		pokemonInfoContainer.appendChild(pokemonNameElement);
		pokemonInfoContainer.appendChild(pokemonImageElement);
		pokemonInfoContainer.appendChild(pokemonTypesElement);
		pokemonInfoContainer.appendChild(pokemonHeightElement);
		pokemonInfoContainer.appendChild(pokemonWeightElement);
		pokemonInfoContainer.appendChild(pokemonAbilitiesElement);
	}

	// Mise à jour du bouton retour avec numéro de page
	document.querySelector(".navRetour ").addEventListener("click", function () {
		window.location.href = "../index.html?page=" + page;
	});

	// Affiche le bouton lorsque l'utilisateur fait défiler vers le bas
	window.onscroll = function () {
		scrollFunction();
	};

	function scrollFunction() {
		const backToTopButton = document.getElementById("backToTop");
		if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
			backToTopButton.style.display = "block";
		} else {
			backToTopButton.style.display = "none";
		}
	}

	// Retourne en haut de la page lorsque l'utilisateur clique sur le bouton
	document.getElementById("backToTop").addEventListener("click", function () {
		document.body.scrollTop = 0; // Apple
		document.documentElement.scrollTop = 0; // Chrome, Firefox, IE et Opera...
	});
});
