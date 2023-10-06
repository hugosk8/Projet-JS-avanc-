const baseURL = "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";
const liste = document.getElementById('liste_cinemas');
const coordonnees = document.getElementById('coordonnees');
let userLatitude;
let userLongitude;

function calculateDistance(userLat, userLon, cinemaLat, cinemaLon) {
    const earthRadiusKm = 6371;

    console.log(userLat, userLon, cinemaLat, cinemaLon);

    if (isNaN(userLat) || isNaN(userLon) || isNaN(cinemaLat) || isNaN(cinemaLon)) {
        return 'Le calcul a echoué :/';
    }

    const diffLat = (cinemaLat - userLat) * Math.PI / 180;
    const diffLon = (cinemaLon - userLon) * Math.PI / 180;

    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(cinemaLat * Math.PI / 180) * 
              Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

window.addEventListener('DOMContentLoaded', () => {
    
    navigator.geolocation.getCurrentPosition(position => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        
        coordonnees.innerHTML = `<p>Latitude : ${userLatitude} / Longitude : ${userLongitude}</p>`;

        fetch(`${baseURL}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.results);
            data.results.sort((a, b) => b.fauteuils - a.fauteuils);
            data.results.forEach(cinema => {
                const cinemaLat = cinema.latitude;
                const cinemaLon = cinema.longitude;
                
                const distance = calculateDistance(userLatitude, userLongitude, cinemaLat, cinemaLon) + ' km';
    
                liste.innerHTML += `
                <li>
                <p>Nom : ${cinema.nom}</p>
                <p>Adresse : ${cinema.adresse}</p>
                <p>Ville : ${cinema.commune}</p>
                <p>Nombre de fauteuils : ${cinema.fauteuils}</p>
                <p>Distance de l'utilisateur : ${distance}</p>
                </li>
                `;
            })
        })
    })
})