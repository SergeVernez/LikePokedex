// On charge tout le document (DOM) pour s'assurer que le script s'applique à tout le DOM
ocument.addEventListener("DOMContentLoaded", () => {
	// sélectionne l'element avec l'ID pokemonCard et le stock dans la constante pokemonContainer
	const pokemonContainer = document.getElementById("pokemonCard");

	//--- Appel de l'API pokémon---
	function fetchPokemon() {
		//Utilise fetch pour une requete HTTP GET à l'API
		fetch("https://pokeapi.co/api/v2/pokemon")
			.then((response) => response.json()) //convertit la reponse en JSON (plus lisible dans la console au lieu de donées brut)
			.then((data) => {
				console.log(data); //Affiche les données dans la console
				myDisplay(data); //Appel la fonction myDisplay
			})
			.catch((error) => console.error("Erreur:", error)); //Affiche les erreurs de la requete fetch s'il y en a
	}
	function myDisplay(data) {
		console.log("données reçues:", data); //fonction pour afficher les données reçu dans la console
	}
	fetchPokemon(); //Appel la fonction fetchPokemon
});
