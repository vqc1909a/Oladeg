import {
    $inputDescriptionQuill,
} from "../../dom.js";
import Quill from 'quill';
let Delta = Quill.import('delta');

const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Escribe algo...',
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

