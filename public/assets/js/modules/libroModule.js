import Quill from 'quill';
let Delta = Quill.import('delta');
import Swal from "sweetalert2";
import axios from "axios";

import {
    $fileInputLibro,
    $imagePreviewLibro,
    $buttonsDeleteLibro,
    $inputDescriptionQuill
} from "../dom.js";
import * as ROUTES from "../../../../config/routes.js";

let arrayButtonsDeleteLibro = Array.from($buttonsDeleteLibro);
if(arrayButtonsDeleteLibro.length){
  arrayButtonsDeleteLibro.forEach(function(button){
    button.addEventListener('click', function(e){
      const id = e.currentTarget.dataset.id;
      console.log(id);

      Swal.fire({
        title: 'Estás seguro de eliminar el libro?',
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
            const {data} = await axios.delete(`${ROUTES.ELIMINAR_LIBRO.replace(':id', id)}`, {
              headers: {
                'x-csrf-token': csrfToken
              }
            });
            Swal.fire({
                title: '¡Eliminado!',
                text: "El libro fue eliminado correctamente",
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

if($fileInputLibro){
  $fileInputLibro.addEventListener('change', function(event) {
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
        $imagePreviewLibro.innerHTML = '';
        $imagePreviewLibro.appendChild(image);
      });

      //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
      reader.readAsDataURL(file);
    }
  });  
}

const editor = document.querySelector("#editor");
if(editor){
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Escribe algo...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                // ['link', 'image', 'video'],
                ['link', 'video'],
                ['blockquote', 'code-block'],
                [ {'direction': 'rtl'}, { 'align': [] }],
                //  [{ 'font': [] }],              
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                // [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean']
            ]
        }
    });

    // Store accumulated changes
    let change = new Delta();

    // El objeto Delta y el método getContents() son herramientas que proporciona Quill para trabajar con el contenido enriquecido del editor de forma estructurada y realizar operaciones avanzadas si es necesario. Sin embargo, si solo necesitas mostrar el contenido en otras páginas, puedes acceder directamente al HTML del editor utilizando editor.innerHTML o editor.innerText. TODO ESTO DEBAJO NO SERÍA NECESARIO
    quill.on('text-change', function(delta, oldDelta, source) {
        change = change.compose(delta);
        console.log({
            content: quill.getContents(),
            html: quill.root.innerHTML
        })
        //No olvides que en front donde vas a poner el html de tu base de datos, tienes que ponerlo dentro de la sigueinte etiqueta para que te aplique todos los estilos que pusiste en el editor '<div class="ql-editor">'
        $inputDescriptionQuill.value = quill.root.innerHTML;
    });
}



