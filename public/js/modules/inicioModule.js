import {
  header,
  hamburguer,
  main_nav,
  sec_nav,
  overlay,
  links,
  links1,
  links2,
  hero,
  menu_overlay,
  nosotros,
  nosotros_items,
  banner,
  banner2,
  banner2_title,
  curso,
  main,
  anuncios_items,
  anuncios,
  appear_contents,
  candado,
  cursos,
  formas_de_pago,
  contact,
  boletines,
  quienes_somos,
  nuestra_experiencia,
  nuestros_servicios
} from '../dom';

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

//GSAP
let links_array = Array.from(links);
let links1_array = Array.from(links1);
let links2_array = Array.from(links2);
let links1_array_animation = gsap.from(links1_array, {duration: 2, translateX: -150, opacity: 0, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "elastic(1, 0.3)", force3D: true, paused: true});
let links2_array_animation = gsap.from(links2_array, {duration: 2, translateX: 150, opacity: 0, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "elastic(1, 0.3)", force3D: true, paused: true});
let tl = gsap.timeline({repeat: -1, yoyo: true, paused: true});
let links_array_animation = tl.to(links_array, {duration: 1, scale: 1.2, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "none", force3D: true});

hamburguer.addEventListener('click', function(){
  console.log("click hamburguer")
  if( header.classList.contains('open')){
    header.classList.remove('open');
    header.classList.add('close');
  }else{
    header.classList.remove('close');
    header.classList.add('open');
    links1_array_animation.restart();
    links2_array_animation.restart();
    links_array_animation.restart();
  }
})
let distance_bottom_sec_nav = sec_nav.getBoundingClientRect().bottom;
let height_sec_nav = sec_nav.getBoundingClientRect().height;
let height_header = header.getBoundingClientRect().height;

menu_overlay.style.top = `${height_header}px + 20vh`;
overlay.style.height = `calc(100vh - (${height_sec_nav}px + 10vh))`;


let nosotrosItemsArray = Array.from(nosotros_items);
let anunciosItemsArray = Array.from(anuncios_items);
let appearContentsArray = Array.from(appear_contents);
let boletinesArray = Array.from(boletines);
let animateNosotrosItemsArray = gsap.from(nosotrosItemsArray, {duration: 2, scale: 0.5, opacity: 0, delay: 1, stagger: {each: .5, from: "start"}, ease: "elastic(1, 0.3)", force3D: true});
// let animateAnunciosItemsArray = gsap.from(anunciosItemsArray, {duration: 1, delay: 1, stagger: {each: .5, from: "start"}, ease: "back(4)", force3D: true, xPercent: -100,  opacity: 0});

CustomEase.create("custom_acercamiento", "M0,0 C0.006,0.016 0.1,0.4 0.2,0.4 0.3,0.4 0.4,0 0.4,0 0.4,0 0.448,1 0.7,1 0.952,1 1,0 1,0 ")
gsap.to(candado, {duration: 2, ease: "custom_acercamiento", scale: 2, rotate: "20", force3D: true, repeat: -1, repeatDelay: 1});
animateNosotrosItemsArray.pause();
window.onscroll = function(){
  distance_bottom_sec_nav = sec_nav.getBoundingClientRect().bottom;
  height_sec_nav = sec_nav.getBoundingClientRect().height;

  if(window.location.pathname === '/cursos/' || window.location.pathname === '/diplomados/' || window.location.pathname === '/especializaciones/' || window.location.pathname === '/boletines/' || window.location.pathname === '/libros/'){
    banner2_title.style.transform = `translate3d(0px, ${.5 * window.scrollY}px, 0px)`;
    banner2_title.style.opacity = 1 - window.scrollY/500;
  }

  if(distance_bottom_sec_nav < 0){
    main_nav.classList.add('flight');
    hamburguer.classList.add('flight');
    overlay.style.top = `calc(${-distance_bottom_sec_nav + height_sec_nav}px + 10vh)`;
    overlay.style.height = "90vh";
    if(window.location.pathname === '/'){
      hero.style.marginTop = "10vh";
    }

    if(window.location.pathname === '/consultorias/' || window.location.pathname === "/quienes-somos/" || window.location.pathname === "/nuestra-experiencia/" || window.location.pathname === "/nuestros-servicios/" || window.location.pathname === "/formas-de-pago/" || window.location.pathname === "/contacto/"){
      banner.style.marginTop = "10vh";
      if(window.location.pathname === '/consultorias/' & window.innerWidth < 1024){
        main.style.marginTop = "10vh";
      }
      if(window.location.pathname === '/formas-de-pago/' & window.innerWidth < 1024){
        formas_de_pago.style.marginTop = "10vh";
      }
      if(window.location.pathname === '/contacto/' & window.innerWidth < 1024){
        contact.style.marginTop = "10vh";
      }    
      if(window.location.pathname === '/quienes-somos/' & window.innerWidth < 1024){
        quienes_somos.style.marginTop = "10vh";
      } 
      if(window.location.pathname === '/nuestra-experiencia/' & window.innerWidth < 1024){
        nuestra_experiencia.style.marginTop = "10vh";
      } 
      if(window.location.pathname === '/nuestros-servicios/' & window.innerWidth < 1024){
        nuestros_servicios.style.marginTop = "10vh";
      }   
    }
    if(window.location.pathname === '/cursos/' || window.location.pathname === '/diplomados/' || window.location.pathname === '/especializaciones/' || window.location.pathname === '/boletines/' || window.location.pathname === '/libros/'){
      banner2.style.marginTop = "10vh";
      if(window.location.pathname === '/cursos/' & window.innerWidth < 1024){
        cursos.style.marginTop = "10vh";
      }
      if(window.location.pathname === '/diplomados/' & window.innerWidth < 1024){
        cursos.style.marginTop = "10vh";
      }
      if(window.location.pathname === '/especializaciones/' & window.innerWidth < 1024){
        cursos.style.marginTop = "10vh";
      }
      if((window.location.pathname === '/libros/' & window.innerWidth < 1024) || (window.location.pathname === '/boletines/' & window.innerWidth < 1024)){
        boletinesArray.forEach((boletin) => {
          boletin.style.marginTop = "10vh";
        })
      }
    }
    if(window.location.pathname.slice(0,7) === '/curso/' || window.location.pathname.slice(0, 11) === '/diplomado/' || window.location.pathname.slice(0,17) === '/especializacion/'){
      curso.style.marginTop = "10vh"
    }
    if(window.location.pathname.slice(0,9) === '/anuncio/' || window.location.pathname.slice(0,9) === '/boletin/' || window.location.pathname.slice(0,7) === '/libro/'){
      main.style.marginTop = "10vh"
    }
  }else{
    main_nav.classList.remove('flight');
    hamburguer.classList.remove('flight');
    overlay.style.top = 'initial';
    overlay.style.height = `calc(100vh - (${distance_bottom_sec_nav}px + 10vh))`;

    if(window.location.pathname === '/'){
      hero.style.marginTop = "0rem";
    }

    if(window.location.pathname === '/consultorias/' || window.location.pathname === "/quienes-somos/" || window.location.pathname === "/nuestra-experiencia/" || window.location.pathname === "/nuestros-servicios/" || window.location.pathname === "/formas-de-pago/" || window.location.pathname === "/contacto/"){
      banner.style.marginTop = "0rem";
      if(window.location.pathname === '/consultorias/' & window.innerWidth < 1024){
        main.style.marginTop = "0rem";
      }
      if(window.location.pathname === '/formas-de-pago/' & window.innerWidth < 1024){
        formas_de_pago.style.marginTop = "0rem";
      }
      if(window.location.pathname === '/contacto/' & window.innerWidth < 1024){
        contact.style.marginTop = "0rem";
      }  
      if(window.location.pathname === '/quienes-somos/' & window.innerWidth < 1024){
        quienes_somos.style.marginTop = "0rem";
      } 
      if(window.location.pathname === '/nuestra-experiencia/' & window.innerWidth < 1024){
        nuestra_experiencia.style.marginTop = "0rem";
      } 
      if(window.location.pathname === '/nuestros-servicios/' & window.innerWidth < 1024){
        nuestros_servicios.style.marginTop = "0rem";
      }   

    }

    if(window.location.pathname === '/cursos/' || window.location.pathname === '/diplomados/' || window.location.pathname === '/especializaciones/' || window.location.pathname === '/boletines/' || window.location.pathname === '/libros/'){
      banner2.style.marginTop = "0rem";
      if(window.location.pathname === '/cursos/' & window.innerWidth < 1024){
        cursos.style.marginTop = "0rem";
      }
      if(window.location.pathname === '/diplomados/' & window.innerWidth < 1024){
        cursos.style.marginTop = "0rem";
      }
      if(window.location.pathname === '/especializaciones/' & window.innerWidth < 1024){
        cursos.style.marginTop = "0rem";
      }
      if((window.location.pathname === '/libros/' & window.innerWidth < 1024) || (window.location.pathname === '/boletines/' & window.innerWidth < 1024)){
        boletinesArray.forEach((boletin) => {
          boletin.style.marginTop = "0rem";
        })
      }
    }
    if(window.location.pathname.slice(0,7) === '/curso/' || window.location.pathname.slice(0, 11) === '/diplomado/' || window.location.pathname.slice(0,17) === '/especializacion/'){
      curso.style.marginTop = "0rem"
    }
     if(window.location.pathname.slice(0,9) === '/anuncio/' || window.location.pathname.slice(0,9) === '/boletin/' || window.location.pathname.slice(0,7) === '/libro/'){
      main.style.marginTop = "0rem"
    }
   
  }
  
  //Nosotros Section
  if(window.location.pathname === '/'){
    if(nosotros.getBoundingClientRect().top < window.innerHeight / 1.2){
      animateNosotrosItemsArray.play();
    }else{
      animateNosotrosItemsArray.restart();
      animateNosotrosItemsArray.pause();
    }

    // if(anuncios.getBoundingClientRect().top < window.innerHeight / 1.2){
    //   animateAnunciosItemsArray.play();
    // }else{
    //   animateAnunciosItemsArray.restart();
    //   animateAnunciosItemsArray.pause();
    // }
  }
  //Appear Contents
  appearContentsArray.forEach(content => {
    const top = content.getBoundingClientRect().top;
    if(top < window.innerHeight / 1.2){
          content.classList.add("intro-appear");
    }else{
          content.classList.remove("intro-appear");
    }
  })
}




