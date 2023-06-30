import {
  deposito_button_1,
  deposito_button_2,
  deposito_button_3,
  deposito_input
} from '../dom';

import {gsap} from 'gsap';
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

CustomEase.create("custom_button", "M0,0.5,C0,0.5,0.008,1,0.034,1,0.06,1,0.042,0,0.066,0,0.092,0,0.074,1,0.1,1,0.126,1,0.102,0,0.126,0,0.152,0,0.144,0.974,0.168,0.974,0.194,0.974,0.168,0.028,0.192,0.028,0.216,0.028,0.216,0.95,0.24,0.95,0.264,0.95,0.244,0.042,0.268,0.042,0.296,0.042,0.278,0.926,0.306,0.926,0.328,0.926,0.304,0.058,0.33,0.058,0.36,0.058,0.348,0.902,0.372,0.902,0.396,0.902,0.376,0.1,0.4,0.1,0.426,0.1,0.416,0.852,0.442,0.852,0.468,0.852,0.438,0.152,0.464,0.152,0.49,0.152,0.476,0.8,0.5,0.8,0.526,0.8,0.506,0.2,0.532,0.2,0.56,0.2,0.54,0.75,0.562,0.75,0.586,0.75,0.576,0.252,0.6,0.252,0.626,0.252,0.604,0.696,0.626,0.696,0.648,0.696,0.64,0.296,0.664,0.296,0.69,0.296,0.68,0.648,0.704,0.648,0.728,0.648,0.714,0.348,0.736,0.348,0.758,0.348,0.754,0.6,0.778,0.6,0.804,0.6,0.788,0.404,0.81,0.404,0.832,0.404,0.824,0.566,0.848,0.566,0.872,0.566,0.854,0.448,0.878,0.448,0.9,0.448,0.892,0.538,0.916,0.538,0.938,0.538,0.928,0.474,0.948,0.474,0.968,0.474,0.958,0.494,0.968,0.502,0.982,0.514,1,0.5,1,0.5");

let animate_button1 = gsap.to(deposito_button_1, {duration: 1, ease: "custom_button", x: 10, paused: true});
let animate_button2 = gsap.to(deposito_button_2, {duration: 1, ease: "custom_button", x: 10, paused: true});
let animate_button3 = gsap.to(deposito_button_3, {duration: 1, ease: "custom_button", x: 10, paused: true});

if(window.location.pathname === "/formas-de-pago/"){
  deposito_button_1.addEventListener('click', (e) => {
    animate_button1.restart();
    let text = deposito_button_1.textContent
    deposito_input.value = text;
    deposito_input.select();
    deposito_input.setSelectionRange(0, 99999);
    document.execCommand("copy");
  })
  deposito_button_2.addEventListener('click', (e) => {
    animate_button2.restart();
    let text = deposito_button_2.textContent
    deposito_input.value = text;
    deposito_input.select();
    deposito_input.setSelectionRange(0, 99999);
    document.execCommand("copy");
  })
  deposito_button_3.addEventListener('click', (e) => {
    animate_button3.restart();
    let text = deposito_button_3.textContent
    deposito_input.value = text;
    deposito_input.select();
    deposito_input.setSelectionRange(0, 99999);
    document.execCommand("copy");
  })
}


