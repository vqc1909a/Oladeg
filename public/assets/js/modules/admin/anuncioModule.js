import {
    $fileInputAnuncio,
    $imagePreviewAnuncio
} from "../../dom.js";

$fileInputAnuncio.addEventListener('change', function(event) {
  const file = event.target.files[0];

  if (file) {
    // Creamos una nueva instancia de FileReader, que nos permitirá leer el contenido del archivo seleccionado
    const reader = new FileReader();

    reader.addEventListener('load', function() {
      const image = document.createElement('img');
      // reader.result contiene una URL de datos (Data URL) que representa el contenido del archivo.
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEU.......
      image.src = reader.result;
      image.style.width = "100%";
      image.style.height = "300px";
      $imagePreviewAnuncio.innerHTML = '';
      $imagePreviewAnuncio.appendChild(image);
    });

    //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
    reader.readAsDataURL(file);
  }

});