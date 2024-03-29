import Quill from 'quill';
let Delta = Quill.import('delta');
import Swal from "sweetalert2";
import axios from "axios";

import {
  $fileInputPrograma1,
  $imagePreviewPrograma1,
  $fileInputPrograma2,
  $imagePreviewPrograma2,
  $fileInputPrograma3,
  $imagePreviewPrograma3,
  $inputInscripcionQuill,
  $inputTemarioQuill,
  $inputMaterialesQuill,
  $inputPromocionQuill,
  $inputMetodologiaQuill,
  $buttonsDeletePrograma,
} from "../dom.js";

import * as ROUTES from "../../../../config/routes.js";


//Programa Academico
const editores = ["editorInscripcion", "editorTemario", "editorMateriales", "editorPromocion", "editorMetodologia"];
const inputs = [$inputInscripcionQuill, $inputTemarioQuill, $inputMaterialesQuill, $inputPromocionQuill, $inputMetodologiaQuill];

const editorInscripcion = document.querySelector(`#${editores[0]}`);
const editorTemario = document.querySelector(`#${editores[1]}`);
const editorMateriales = document.querySelector(`#${editores[2]}`);
const editorPromocion = document.querySelector(`#${editores[3]}`);
const editorMetodologia = document.querySelector(`#${editores[4]}`);


if(editorInscripcion && editorTemario && editorMateriales && editorPromocion && editorMetodologia){

    editores.forEach((editor, i) => {
        const quill = new Quill(`#${editor}`, {
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
            inputs[i].value = quill.root.innerHTML;
        });
    })
}

if($fileInputPrograma1){
  $fileInputPrograma1.addEventListener('change', function(event) {
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
        $imagePreviewPrograma1.innerHTML = '';
        $imagePreviewPrograma1.appendChild(image);
      });

      //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
      reader.readAsDataURL(file);
    }
  });  
}

if($fileInputPrograma2){
  $fileInputPrograma2.addEventListener('change', function(event) {
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
        $imagePreviewPrograma2.innerHTML = '';
        $imagePreviewPrograma2.appendChild(image);
      });

      //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
      reader.readAsDataURL(file);
    }
  });  
}

if($fileInputPrograma3){
  $fileInputPrograma3.addEventListener('change', function(event) {
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
        $imagePreviewPrograma3.innerHTML = '';
        $imagePreviewPrograma3.appendChild(image);
      });

      //Iniciamos la lectura del contenido del archivo seleccionado como una URL de datos (Data URL). Esto hace que el FileReader lea el contenido del archivo y dispare el evento "load" cuando la lectura se complete
      reader.readAsDataURL(file);
    }
  });  
}

let arrayButtonsDeletePrograma = Array.from($buttonsDeletePrograma);
if(arrayButtonsDeletePrograma.length){
  arrayButtonsDeletePrograma.forEach(function(button){
    button.addEventListener('click', function(e){
      const id = e.currentTarget.dataset.id;

      Swal.fire({
        title: 'Estás seguro de eliminar el programa académico?',
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
            const {data} = await axios.delete(`${ROUTES.ELIMINAR_PROGRAMA.replace(':id', id)}`, {
              headers: {
                'x-csrf-token': csrfToken
              }
            });
            Swal.fire({
                title: '¡Eliminado!',
                text: "El programa académico fue eliminado correctamente",
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
