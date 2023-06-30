
import { 
    $formBuscadorLeaflet, 
    $inputDireccionMeeti, 
    $inputCiudadMeeti, 
    $inputCodPaisMeeti,
    $inputEstadoMeeti, 
    $inputPaisMeeti, 
    $inputCodPostalMeeti, 
    $inputLatMeeti, 
    $inputLngMeeti,
} from "../dom.js";
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';

//ESTE KEY LO OBTENEMOS DE ARCGIS REVERSE GEOCODING
console.log(process.env.API_KEY_ARCGIS)
const apiKey = process.env.API_KEY_ARCGIS

const lat = $inputLatMeeti.value;
const lng = $inputLngMeeti.value;
const direction = $inputDireccionMeeti.value;

//Configuración del mapa
let zoom = 15;
let map = new L.map('map').setView([0, 0], zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Crear marcadores

//Grupo de marcadores
let markers = new L.FeatureGroup().addTo(map);

//Solicitar permisos de ubicación
map.locate({setView: true, maxZoom: zoom});

//Eventos
map.on("locationfound", function(e){
    let marker = new L.marker();
    marker.setLatLng(e.latlng).addTo(map).bindPopup("Actualmente Estas aqui").openPopup();
    // circle.setLatLng(e.latlng).setRadius(5).addTo(map);
    marker.setIcon(L.icon({
        iconUrl: '/dist/img/icono-ubicacion-actual.png',
        //Mismos estilo que el icono azul por defecto
        iconSize: [41, 41],
        iconAnchor: [20, 41],
        popupAnchor: [0, -41]
    }));
    console.log(`Ubicación encontrada en ${e.latlng.toString()}`);

    //Ubicar el pin en el lugar buscado anteriormente cuando se redirecciona la pagina por algun campo que falta completar 
    if(lat && lng){
        const bounds = [lat, lng]
        asignarMarcador(bounds, direction);
    }

    
});
map.on("locationerror", function(e){
    alert(e.message);
    //Ubicar el pin en el lugar buscado anteriormente cuando se redirecciona la pagina por algun campo que falta completar 
    if(lat && lng){
        const bounds = [lat, lng]
        asignarMarcador(bounds, direction);  
    }
});
map.on("zoom", function(){
    console.log(map.getZoom());
})


//GEOSEARCH
//Estamos usando el proveedor de busqueda de OpenStreetMap,también puede optar por utilizar los proveedores de Algolia, Bing, Esri, Google, LocationIQ u OpenCage.
//Aqui lo estamos añadiendo automaticamente la opción de búsqueda a nuestro mapa
const provider = new OpenStreetMapProvider({
  params: {
    email: 'vqc1909a@gmail.com', // auth for large number of requests
  },
});
const search = new GeoSearchControl({
  provider,
  showPopup: true,
  marker: {
    draggable: true,
  },
  searchLabel: 'Ingresa la dirección del meeti', // optional: string      - default 'Enter address'
  autoClose: true,
  keepResult: true,
  retainZoomLevel: true,
  style: 'button', // button is default
});
map.addControl(search);


//Añadiendo la busqueda mediante un input externo
$formBuscadorLeaflet.addEventListener('input', function(e){
    const direction = e.target.value.trim();
    if(direction.length > 8){
       buscarDireccion(provider, direction)
    }
})

function buscarDireccion(provider, direction){
    //Utilizar el provider de GeoSearch, esto me ejcuta muchas veces por cada letra que escribimos
    provider.search({query: direction}).then(resultados => {
        const bounds = resultados[0]?.bounds[0] || [0, 0];
        const direction = resultados[0]?.label || "";
        // TODO EL CODIGO DEL GEOSEARCH LO PONEMOS DENTRO DEL REVERSE GEOCODE PARA QUE ME CAPTURE A LA VEZ LA INFORMACIÓN DE DICHA LONGITUD Y LATITUD CAPTURADA, ESTO PARA MAPEARLO EN LOS INPUTS QUE ESTAN DEBAJO
        geocodeService.reverseGeocode({apikey: apiKey}).latlng(bounds).run(function(err, result) {
            if (err) {
                console.log(err);
                return;
            }
            llenarInputs(direction, result);
            asignarMarcador(bounds, direction)
        });
    })
    .catch(err => {
        console.log(err)
    })
}

function llenarInputs(direction, result){
    // {
    //     "Match_addr": "Avenida Carrera 24, La Soledad, Teusaquillo, Bogotá, D.C.",
    //     "LongLabel": "Avenida Carrera 24, La Soledad, Teusaquillo, Bogotá, D.C., COL",
    //     "ShortLabel": "Avenida Carrera 24",
    //     "Addr_type": "StreetName",
    //     "Type": "",
    //     "PlaceName": "",
    //     "AddNum": "",
    //     "Address": "Avenida Carrera 24",
    //     "Block": "",
    //     "Sector": "",
    //     "Neighborhood": "La Soledad",
    //     "District": "Teusaquillo",
    //     "City": "Bogotá, D.C.",
    //     "MetroArea": "",
    //     "Subregion": "Bogotá, D.C.",
    //     "Region": "Bogotá, D.C.",
    //     "RegionAbbr": "DC",
    //     "Territory": "",
    //     "Postal": "111311",
    //     "PostalExt": "",
    //     "CntryName": "Colombia",
    //     "CountryCode": "COL"
    // }
    $inputDireccionMeeti.value = direction || result?.addres?.LongLabel || result?.address?.Match_addr || result?.addres?.ShortLabel || result?.address?.Address || ""; 
    $inputCodPaisMeeti.value = result?.address?.CountryCode
    $inputPaisMeeti.value = result?.address?.CntryName || ""; 
    $inputEstadoMeeti.value = result?.address?.Region || result?.address.RegionAbbr || "";
    $inputCiudadMeeti.value = result?.address?.City || result?.address?.MetroArea || "" + " " + result?.address?.Subregion || "";
    $inputCodPostalMeeti.value = result?.address?.Postal || result?.address?.PostalExt || "";
    $inputLatMeeti.value = result?.latlng?.lat || "";
    $inputLngMeeti.value = result?.latlng?.lng || "";
}

function asignarMarcador(bounds, direction){
    //1. FORMA: Buscarme la dirección de forma automatica mientras voy escribiendo en el input sin la necesidad de mostrarme un listado
    markers.clearLayers();
    //Extraemos el bounds del primer registro porque es el mas acertado con la palabra, aunque tambien los otros lo pueden ser
    map.setView(bounds, zoom);

    //Esto te va creando un nuevo marker cada vez que escribimos en el input y el open popup es siempre para el ultimo marcador creado
    let marker = new L.marker(bounds, {
        draggable: true,
        //Para que al mover el marker se mueva el mapa también
        autoPan: true
    }).addTo(map).bindPopup(direction).openPopup();

    markers.addLayer(marker);

    //Detectar movimiento del marker
    marker.on('moveend', function(e){
        const latlng = e.target.getLatLng();
        //Desplazar el centro del mapa a la instancia de LatLng
        map.panTo(new L.LatLng(latlng.lat, latlng.lng));
        //Hacemos un nuevo reverse geocode cada vez que soltamos el marker en la posición deseada
        geocodeService.reverseGeocode({apikey: apiKey}).latlng(latlng).run(function(error, result) {
            if (error) {
                console.log(error);
                return;
            }
            //Bindeamos el nuevo mensaje del popup del marker
            marker.bindPopup(result?.address?.LongLabel || result?.address?.Match_addr || result?.address?.Address || "").openPopup();
            llenarInputs("", result);
        })
    })
    //2. FORMA: ERA DE HACERLO CON EL TAG DATALIST PERO ESTO NO TE DEJA PONER NINGUN ESTILO POR CUALQUEIR LADO QUE LE QUEIRAS PONER, caso contrario lo harias con ul y list pero hay que aumentarle mas cositas ahi, asi que lo dejamos ahi
}
