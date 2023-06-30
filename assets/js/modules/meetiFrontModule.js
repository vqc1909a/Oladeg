import axios from "axios";
import Swal from 'sweetalert2'
import { 
    $formConfirmarAsistencia,
    $mensajeConfirmarAsistencia,
    $cantidadInteresadosMeeti,
    $formsEliminarComentario
} from "../dom.js";

if($formConfirmarAsistencia){
    $mensajeConfirmarAsistencia.textContent = "";
    const $buttonConfirmarAsistencia = $formConfirmarAsistencia.querySelector("input[type='submit']")
    //Esto me va a ejecutar o prevenir el envio del formulario solo para el post porque para el get no consume el script del bundle pero cuando ya esta logueado el usuario, ahi recien consume el bundle y con ello recien me hace el prevent default
    $formConfirmarAsistencia.addEventListener('submit', async function(e){
        e.preventDefault();
        const action = e.target.action;
        try{
            const {data} = await axios.post(action);
            if(data.message === "confirmar"){
                $buttonConfirmarAsistencia.value = "Cancelar";
                $buttonConfirmarAsistencia.classList.remove("btn-azul");
                $buttonConfirmarAsistencia.classList.add("btn-rojo");
                $mensajeConfirmarAsistencia.textContent = "Has confirmado tu asistencia";
                $cantidadInteresadosMeeti.textContent = `${data.interesados} Asistentes`
                
            }else if(data.message === "cancelar"){
                $buttonConfirmarAsistencia.value = "Si";
                $buttonConfirmarAsistencia.classList.remove("btn-rojo");
                $buttonConfirmarAsistencia.classList.add("btn-azul");
                $mensajeConfirmarAsistencia.textContent = "Has cancelado tu asistencia";
                $cantidadInteresadosMeeti.textContent = `${data.interesados} Asistentes`
            }
        }catch(err){
            const message = err.response ? err.response.data.message : err.message;
            $mensajeConfirmarAsistencia.textContent = message;
        }
    })
            
}

if(Array.from($formsEliminarComentario).length){

    Array.from($formsEliminarComentario).forEach($formEliminarComentario => {
       
        //Esto me va a ejecutar o prevenir el envio del formulario solo para el post porque para el get no consume el script del bundle pero cuando ya esta logueado el usuario, ahi recien consume el bundle y con ello recien me hace el prevent default
        $formEliminarComentario.addEventListener('submit', async function(e){
            e.preventDefault();
            const action = e.target.action;
            const $comentarioAEliminar = e.target.parentNode.parentNode;
            Swal.fire({
                icon: 'warning',
                title: 'Estás seguro de eliminar el comentario?',
                text: 'Esta acción no se puede revertir!',
                showDenyButton: true,
                confirmButtonText: 'Sí',
                denyButtonText: `Cancelar`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    try{
                        const {data} = await axios.post(action);
                        //Eliminar del dom
                        $comentarioAEliminar.remove();
                        Swal.fire({
                            icon: 'success',
                            title: data.message,
                            text: "",
                        })
                    }catch(err){
                        //El err.response.status = number se obtiene gracias al return res.status(number) en el backend
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
