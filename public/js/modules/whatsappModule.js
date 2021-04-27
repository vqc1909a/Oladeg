import {
  whatsapp_button,
  whatsapp_mensaje,
  whatsapp__send,
  whatsapp__input,
  whatsapp__close
} from '../dom';
import {
  stringToUrl
} from '../functions/stringToUrl';

  whatsapp_button.addEventListener('click', () => {
    if(whatsapp_mensaje.classList.contains('open')){
      whatsapp_mensaje.classList.remove('open');
    }else{
      whatsapp_mensaje.classList.add('open');
    }
  })
  whatsapp__close.addEventListener('click', () => {
    whatsapp_mensaje.classList.remove('open');
  })

  whatsapp__send.addEventListener('click', () => {
    let texto = stringToUrl(whatsapp__input.value)
    window.open(`https://wa.me/51931216468?text=${texto}`, '_blank')
  });

