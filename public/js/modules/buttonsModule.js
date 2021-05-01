import {
  buttons
} from '../dom';

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    let number = e.target.dataset.number;
    window.location.href = `?page=${number}`;
  })
})