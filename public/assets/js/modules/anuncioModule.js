import {
    $fileInputAnuncio,
    $imagePreviewAnuncio,
    $buttonsDeleteAnuncio
} from "../dom.js";
import Swal from "sweetalert2";
import axios from "axios";
import * as ROUTES from "../../../../config/routes.js";


let arrayButtonsDeleteAnuncio = Array.from($buttonsDeleteAnuncio);
if(arrayButtonsDeleteAnuncio.length){
  arrayButtonsDeleteAnuncio.forEach(function(button){
    button.addEventListener('click', function(e){
      const id = e.currentTarget.dataset.id;
      console.log(id);

      Swal.fire({
        title: 'Estás seguro de eliminar el anuncio?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try{
            const {data} = await axios.delete(`${ROUTES.ELIMINAR_ANUNCIO.replace(':id', id)}`, {
              headers: {
                'x-csrf-token': csrfToken
              }
            });
            Swal.fire({
                title: '¡Eliminado!',
                text: "El anuncio fue eliminado correctamente",
                icon: 'success',
                allowOutsideClick: false
            }).then(async (result) => {
                // {
                //   "isConfirmed": true,
                //   "isDenied": false,
                //   "isDismissed": false,
                //   "value": true
                // }
                window.location.reload();
            })
          }catch(err){
            const message = err.response ? err.response.data.message : err.message;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: message,
            })
          }
        }
      })
    })
  })
}

if($fileInputAnuncio){
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
}



