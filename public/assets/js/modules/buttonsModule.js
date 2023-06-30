import {
  buttons
} from '../dom.js';

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    let number = e.target.dataset.number;
    window.location.href = `?page=${number}`;
  })
})