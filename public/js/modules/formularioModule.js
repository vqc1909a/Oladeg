import {
  formulario1,
  formulario2,
  inputs_contact,
  inputs_modal,
  textarea
} from '../dom';
import axios from 'axios';

const expresiones = {
	nombres: /^[a-zA-ZÀ-ÿ\s]{5,30}$/, // Letras y espacios, pueden llevar acentos.
	correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	celular: /^\d{7,14}$/, // 7 a 14 numeros.
  mensaje: /^[a-zA-ZÀ-ÿ0-9\s]{10,300}$/,
  curso: /^[a-zA-ZÀ-ÿ\s]{5,30}$/
}

const campos = {
	nombres: false,
	correo: false,
	celular: false,
	mensaje: false,
	curso: false,
}


const validarFormulario = (e) => {
  switch (e.target.name){
    case "nombres":
      validarCampo(e.target);
    break;
    case "correo":
      validarCampo(e.target);
    break;
    case "celular":
      validarCampo(e.target);
    break;
    case "mensaje":
      validarCampo(e.target);
    break;
    case "curso":
      validarCampo(e.target);
    break;
  }
}
const validarCampo = (campo) => {
  let expresion = campo.name;
  if(expresiones[expresion].test(campo.value)){
    campo.parentNode.classList.remove('input-group--incorrecto');
    campo.parentNode.classList.add('input-group--correcto');
    campo.nextElementSibling.classList.remove("fa-times-circle");
    campo.nextElementSibling.classList.add("fa-check-circle");
    campo.parentNode.nextElementSibling.classList.remove("input-group__error--active");
    campos[expresion] = true;
  }else{
    campo.parentNode.classList.remove('input-group--correcto');
    campo.parentNode.classList.add('input-group--incorrecto');
    campo.nextElementSibling.classList.remove("fa-check-circle");
    campo.nextElementSibling.classList.add("fa-times-circle");
    campo.parentNode.nextElementSibling.classList.add("input-group__error--active");
    campos[expresion] = false;
  }
} 

inputs_contact.forEach((input) => {
  input.addEventListener('keyup', validarFormulario);
  input.addEventListener('blur', validarFormulario);
  textarea.addEventListener('keyup', validarFormulario);
  textarea.addEventListener('blur', validarFormulario);
})

inputs_modal.forEach((input) => {
  input.addEventListener('keyup', validarFormulario);
  input.addEventListener('blur', validarFormulario);
})





if(window.location.pathname === '/contacto/'){
  formulario1.addEventListener('submit', (e) => {
    const {nombres, correo, celular, mensaje} = campos;
    e.preventDefault();
    if(nombres & correo & celular & mensaje){
      document.querySelector(".formulario1 .input-group__mensaje").classList.remove("input-group__mensaje--active");
      document.querySelector(".formulario1 .input-group__mensaje-exito").classList.add("input-group__mensaje-exito--active");

      (async ()=>{
        await axios.post(process.env.BACKEND_URI + "/solicitantes", {
          nombres: document.querySelector(".formulario1 input[name='nombres']").value,
          correo: document.querySelector(".formulario1 input[name='correo']").value,
          celular: document.querySelector(".formulario1 input[name='celular']").value,
          mensaje: document.querySelector(".formulario1 textarea[name='mensaje']").value,
        });
        formulario1.reset();
        document.querySelectorAll(".formulario1 .input-group").forEach((input) => {
          input.classList.remove("input-group--correcto");
        })  
      })();
    }else{
      document.querySelector(".formulario1 .input-group__mensaje-exito").classList.remove("input-group__mensaje-exito--active");
      document.querySelector(".formulario1 .input-group__mensaje").classList.add("input-group__mensaje--active");
    }
  });
}


formulario2.addEventListener('submit', (e) => {
  e.preventDefault();
  const {nombres, correo, celular, curso} = campos;
  if(nombres & correo & celular & curso){
    document.querySelector(".formulario2 .input-group__mensaje").classList.remove("input-group__mensaje--active");
    document.querySelector(".formulario2 .input-group__mensaje-exito").classList.add("input-group__mensaje-exito--active");
    
    (async ()=>{
      await axios.post(process.env.BACKEND_URI + "/solicitantes", {
        nombres: document.querySelector(".formulario2 input[name='nombres']").value,
        correo: document.querySelector(".formulario2 input[name='correo']").value,
        celular: document.querySelector(".formulario2 input[name='celular']").value,
        curso: document.querySelector(".formulario2 input[name='curso']").value,
      });
      formulario2.reset();
      document.querySelectorAll(".formulario2 .input-group").forEach((input) => {
        input.classList.remove("input-group--correcto");
      }) 
    })();
    
  }else{
    document.querySelector(".formulario2 .input-group__mensaje-exito").classList.remove("input-group__mensaje-exito--active");
    document.querySelector(".formulario2 .input-group__mensaje").classList.add("input-group__mensaje--active");
  }
})