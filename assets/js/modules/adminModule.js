import {
    $inputDescriptionQuill,
} from "../dom.js";
import Quill from 'quill';
let Delta = Quill.import('delta');

const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Escribe algo...',
    // En este ejemplo, se han agregado las siguientes opciones al editor:
    // image: Permite insertar imágenes en el editor.
    // link: Permite insertar enlaces.
    // blockquote: Crea un bloque de cita.
    // code-block: Crea un bloque de código.
    // list: Permite crear listas ordenadas y no ordenadas.
    // script: Permite agregar subíndices y superíndices.
    // indent: Aumenta o disminuye la indentación del texto.
    // direction: Cambia la dirección del texto a derecha a izquierda (para idiomas de derecha a izquierda).
    // color y background: Opciones para cambiar el color del texto y el fondo.
    // clean: Limpia todos los estilos y formatos aplicados.
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image', 'video'],
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

// Check for unsaved data, con esto me sale la advertencia de que tengo contenido sin guardar, peor no me sirve cuando hago el post hacia el endpoint
// window.onbeforeunload = function() {
//   if (change.length() > 0) {
//     return 'There are unsaved changes. Are you sure you want to leave?';
//   }
// }

