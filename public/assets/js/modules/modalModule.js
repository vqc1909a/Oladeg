import {
  modal_buttons,
  modal_buttons_close,
  modal_anuncio
} from '../dom';

modal_buttons.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    const modaltarget = document.querySelector(`.${e.target.dataset.modal}`)
    modaltarget.classList.add("modal-bg-open");
  })
})
modal_buttons_close.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.classList.remove("modal-bg-open")
  })
})

window.onload = function(){
  if(window.location.pathname === "/"){
    setTimeout(()=>{
      modal_anuncio.classList.add("modal-bg-open")
    }, 3000)
  }
}