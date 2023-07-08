import {
  buttons
} from '../dom.js';

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    let url = e.target.dataset.url;
    window.location.href = url;
  })
})