import {
  $buttons
} from '../dom.js';

if($buttons.length){
  $buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      let url = e.target.dataset.url;
      window.location.href = url;
    })
  })
}