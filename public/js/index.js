import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './modules/inicioModule';
import './modules/depositosModule';
import './modules/whatsappModule';
import './modules/cursoModule';
import './modules/modalModule';
import './modules/formularioModule';



import showdown from 'showdown';
let converter = new showdown.Converter();


// (async () => {
//   const propiedades = await axios.get("http://localhost:1337/propiedades");
//   const {data} = propiedades;
//   let richtext = data[0].descripcion;
//   let html = converter.makeHtml(`gjhgk\nkhkhk\nssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss`)
//   console.log(richtext);
//   console.log(html);
// })();



