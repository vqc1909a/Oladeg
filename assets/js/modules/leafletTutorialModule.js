// LEAFLET: Leaflet es independiente del proveedor, lo que significa que no impone una elección particular de proveedores para tiles (mosaicos). 
// Además, Leaflet ni siquiera contiene una sola línea de código específica del proveedor, por lo que puede usar otros proveedores si lo necesita.
// Siempre que use algo basado en OpenStreetMap, es obligatoria una atribución según el aviso de derechos de autor. La mayoría de los demás proveedores de mosaicos (como Mapbox, Stamen o Thunderforest) también requieren una atribución. Asegúrese de dar crédito donde se debe.


// En esta primera configuración el map es el id del div a implementar el mapa y elzoom es 13. Tambien no te olvides de dar a ese id su altura ya ncho respectivo
//Configuracion del mapa
let map = new L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Agregando un marcador y bindeandole un popup y dejandolo abierto, solo se peude abrir un popup en el mapa, si abres muchos solo se abrira el ultimo que abriste por codigo
//Creacion de los marcadores de forma independiente o asignandole de forma directa su ubicación
//Para que veas las propiedades y metodos de un marker, simplemente lo ves por el console.log, y los metodos siempre estaran en el prototype del objeto marker
let marker = new L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();

//Agregando un circulo
let circle = new L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map).bindPopup("I am a circle.");

//Agregando un poligono, puede tener muchos vertices
let polygon = new L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map).bindPopup("I am a polygon.");

//Añadir un popup como layer al mapa y su popup se abrira primero antes que todos los demás
let popup = new L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);


//TRATAR CON EVENTOS
//Cada vez que sucede algo en Leaflet, p. el usuario hace clic en un marcador o cambia el zoom del mapa, el objeto correspondiente envía un evento al que puede suscribirse con una función

let popup2 = new L.popup();
function onMapClick(e) {
    console.log({
        e
    })
    popup2
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    
}

//Cuano se esta más cerca, el zoom va aumentando, si esta mas lejso el zoom va disminuyendo, esto se encuentra en lapropiedad e.target._zoom, o e.target._animateToZoom
function onMapZoom(e) {
    console.log({
        zoom: e.target._zoom
    })
    
}

map.on('click', onMapClick);
map.on('zoom', onMapZoom);