// On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM
document.addEventListener("DOMContentLoaded", () => {
	// sélectionne l'element avec l'ID pokemonCard et le stock dans la constante pokemonContainer
	const pokemonContainer = document.getElementById("pokemonCard");

	//--- Appel de l'API pokémon---
	function fetchPokemon() {
		//Utilise fetch pour une requete HTTP GET à l'API
		fetch("https://pokeapi.co/api/v2/pokemon")
			.then((response) => response.json()) //convertit la reponse en JSON (plus lisible dans la console au lieu de donées brut)

			//---- (1)d'abord on cherche les données qui nous interesse comme ceci (avec des console.log)
			// .then((data) => {
			// 	console.log(data); //Affiche les données dans la console
			// 	myDisplay(data); //Appel la fonction myDisplay
			// })
			// .catch((error) => console.error("Erreur:", error)); //Affiche les erreurs de la requete fetch s'il y en a

			// (2)---puis on transforme comme ceci
			.then((data) => {
				displayPokemon(data);
			})
            .catch(error => console.error("Erreu lors de la récupération des données du Pokémon", error));
	}
    // (1) par rapport à la recherche des donnée fonction de récupération console.log
	// function myDisplay(data) {
	// 	console.log("données reçues:", data); //fonction pour afficher les données reçu dans la console
	// }
    // (2) On modifie la fonction (1) comme ceci:
    function displayPokemon(pokemon) {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('card');

        const pokemonImage = document.createElement("img");
        pokemonImage.src = pokemon.sprites.front_default;

        const pokemonName = document.createElement('h2');
        pokemonName.textContent = pokemon.name;

        const pokemonNumber = document.createElement('p')
        pokemonNumber.textContent = `#${pokemon.id}`;

        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonNumber);

        pokemonContainer.appendChild(pokemonCard);
    }
	fetchPokemon(); //Appel la fonction fetchPokemon
});
