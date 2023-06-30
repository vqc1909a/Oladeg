import {
    $fileInputGroup,
    $imagePreviewGroup
} from "../dom.js";

$fileInputGroup.addEventListener('change', function(event) {
  const file = event.target.files[0];
    //event.target.files  
    // 0: File {
    //     lastModified: 1671513252907
    //     lastModifiedDate: Tue Dec 20 2022 00:14:12 GMT-0500 (hora estándar de Perú) {}
    //     name: "sekiro-theme.jpg"
    //     size: 561388
    //     type: "image/jpeg"
    //     webkitRelativePath: ""
    // }

  if (file) {
    // Creamos una nueva instancia de FileReader, que nos permitirá leer el contenido del archivo seleccionado
    const reader = new FileReader();

    reader.addEventListener('load', function() {
      const image = document.createElement('img');
      // reader.result contiene una URL de datos (Data URL) que representa el contenido del archivo.
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEU.......
      image.src = reader.result;
      image.style.width = "100%";
      $imagePreviewGroup.innerHTML = '';
      $imagePreviewGroup.appendChild(image);
    });

    //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
    reader.readAsDataURL(file);
  }


  //MOSTRAR CONTENIDO CARGADO EN MEMORIA (IMAGENES, AUDIO, VIDEO Y DESCARGA DE ARCHIVO PLANOS)
    // Aquí tienes algunos ejemplos de cómo puedes utilizar el resultado (result) en diferentes elementos HTML:

    // Para mostrar una imagen:
    // const image = document.createElement('img');
    // image.src = reader.result;
    // document.body.appendChild(image);

    // Para mostrar un audio:
    // const audio = document.createElement('audio');
    // audio.src = reader.result;
    // document.body.appendChild(audio);

    // Para mostrar un video:
    // const video = document.createElement('video');
    // video.src = reader.result;
    // document.body.appendChild(video);

    // Para mostrar un enlace de descarga:
    // const link = document.createElement('a');
    // link.href = reader.result;
    // link.download = 'archivo.txt';
    // link.innerText = 'Descargar archivo';
    // document.body.appendChild(link);

    // En cada caso, se crea un nuevo elemento HTML (como <img>, <audio>, <video>, <a>, etc.) y se establece el atributo correspondiente (src, href, etc.) con el resultado (result) del FileReader.
});