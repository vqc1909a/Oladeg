import {
  $header,
  $hamburguer,
  $main_nav,
  $sec_nav,
  $overlay,
  $links,
  $links1,
  $links2,
  $hero,
  $menu_overlay,
  $nosotros,
  $nosotros_items,
  $banner,
  $banner2,
  $banner2_title,
  $curso,
  $main,
  $anuncios_items,
  $anuncios,
  $appear_contents,
  $candado,
  $cursos,
  $formas_de_pago,
  $contact,
  $boletines,
  $quienes_somos,
  $nuestra_experiencia,
  $nuestros_servicios,
  $wrapper_banner
} from '../dom.js';

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase.js";
gsap.registerPlugin(CustomEase);

//GSAP
let links_array = Array.from($links);
let links1_array = Array.from($links1);
let links2_array = Array.from($links2);
let links1_array_animation = gsap.from(links1_array, {duration: 2, translateX: -150, opacity: 0, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "elastic(1, 0.3)", force3D: true, paused: true});
let links2_array_animation = gsap.from(links2_array, {duration: 2, translateX: 150, opacity: 0, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "elastic(1, 0.3)", force3D: true, paused: true});
let tl = gsap.timeline({repeat: -1, yoyo: true, paused: true});
let links_array_animation = tl.to(links_array, {duration: 1, scale: 1.2, stagger: {each: .2, from: 'random', grid: "auto"}, ease: "none", force3D: true});

$hamburguer.addEventListener('click', function(){
  console.log("click $hamburguer")
  if( $header.classList.contains('open')){
    $header.classList.remove('open');
    $header.classList.add('close');
  }else{
    $header.classList.remove('close');
    $header.classList.add('open');
    links1_array_animation.restart();
    links2_array_animation.restart();
    links_array_animation.restart();
  }
})
let distance_bottom_sec_nav = $sec_nav.getBoundingClientRect().bottom;
let distance_bottom_main_nav = $main_nav.getBoundingClientRect().bottom;
let height_sec_nav = $sec_nav.getBoundingClientRect().height;
let height_main_nav = $main_nav.getBoundingClientRect().height;
let height_header = $header.getBoundingClientRect().height;

if(window.innerWidth < 1024){
  $menu_overlay.style.top = `calc(${height_header}px + 20vh)`;
}else{
  $menu_overlay.style.top = `calc(${height_header}px + 10vh)`;
}
$overlay.style.height = `calc(100vh - ${distance_bottom_main_nav}px)`;


let nosotrosItemsArray = Array.from($nosotros_items);
let anunciosItemsArray = Array.from($anuncios_items);
let appearContentsArray = Array.from($appear_contents);
let boletinesArray = Array.from($boletines);
let animateNosotrosItemsArray = gsap.from(nosotrosItemsArray, {duration: 2, scale: 0.5, opacity: 0, delay: 1, stagger: {each: .5, from: "start"}, ease: "elastic(1, 0.3)", force3D: true});
// let animateAnunciosItemsArray = gsap.from(anunciosItemsArray, {duration: 1, delay: 1, stagger: {each: .5, from: "start"}, ease: "back(4)", force3D: true, xPercent: -100,  opacity: 0});

CustomEase.create("custom_acercamiento", "M0,0 C0.006,0.016 0.1,0.4 0.2,0.4 0.3,0.4 0.4,0 0.4,0 0.4,0 0.448,1 0.7,1 0.952,1 1,0 1,0 ")
gsap.to($candado, {duration: 2, ease: "custom_acercamiento", scale: 2, rotate: "20", force3D: true, repeat: -1, repeatDelay: 1});
animateNosotrosItemsArray.pause();

if(window.location.pathname.search(/nuestros\-servicios/) !== -1){
  $wrapper_banner.style.backgroundImage = "url('/dist/images/banner3.jpg')";
  $banner.style.padding = "0rem";
  $banner.style.height = "90vh";
}

window.onscroll = function(){
  distance_bottom_sec_nav = $sec_nav.getBoundingClientRect().bottom;
  distance_bottom_main_nav = $main_nav.getBoundingClientRect().bottom;
  height_sec_nav = $sec_nav.getBoundingClientRect().height;
  height_main_nav = $main_nav.getBoundingClientRect().height;


  if(window.location.pathname.search(/cursos/) !== -1 || window.location.pathname.search(/diplomados/) !== -1 || window.location.pathname.search(/especializaciones/) !== -1 || window.location.pathname.search(/boletines/) !== -1 || window.location.pathname.search(/libros/) !== -1){
    $banner2_title.style.transform = `translate3d(0px, ${.5 * window.scrollY}px, 0px)`;
    $banner2_title.style.opacity = 1 - window.scrollY/500;
  }

  if(distance_bottom_sec_nav < 0){
    $main_nav.classList.add('flight');
    $hamburguer.classList.add('flight');
    //AQui el calculo lo hace desde el top del header no del body
    $overlay.style.top = `calc(${-distance_bottom_sec_nav + height_sec_nav}px + ${height_main_nav}px)`;
    $overlay.style.height = "100vh";
    if(window.location.pathname === '/'){
      $hero.style.marginTop = "8vh";
    }

    if(window.location.pathname.search(/consultorias/) !== -1 || window.location.pathname.search(/quienes\-somos/) !== -1 || window.location.pathname.search(/nuestra\-experiencia/) !== -1 || window.location.pathname.search(/nuestros\-servicios/) !== -1 || window.location.pathname.search(/formas\-de\-pago/) !== -1 || window.location.pathname.search(/contacto/) !== -1 || window.location.pathname.search(/publicidad/) !== -1){
      $banner.style.marginTop = "8vh";
      if(window.location.pathname.search(/consultorias/) !== -1  && window.innerWidth < 1024){
        $main.style.marginTop = "8vh";
      }
      if(window.location.pathname.search(/publicidad/) !== -1 && window.innerWidth < 1024){
        $main.style.marginTop = "8vh";
      }
      if(window.location.pathname.search(/formas\-de\-pago/) !== -1 && window.innerWidth < 1024){
        $formas_de_pago.style.marginTop = "8vh";
      }
      if(window.location.pathname.search(/contacto/) !== -1 && window.innerWidth < 1024){
        $contact.style.marginTop = "8vh";
      }    
      if(window.location.pathname.search(/quienes\-somos/) !== -1 && window.innerWidth < 1024){
        $quienes_somos.style.marginTop = "8vh";
      } 
      if(window.location.pathname.search(/nuestra\-experiencia/) !== -1 && window.innerWidth < 1024){
        $nuestra_experiencia.style.marginTop = "8vh";
      } 
      if(window.location.pathname.search(/nuestros\-servicios/) !== -1 && window.innerWidth < 1024){
        $nuestros_servicios.style.marginTop = "8vh";
      }   
    }
    if(window.location.pathname.search(/cursos/) !== -1 || window.location.pathname.search(/diplomados/) !== -1 || window.location.pathname.search(/especializaciones/) !== -1 || window.location.pathname.search(/boletines/) !== -1 || window.location.pathname.search(/libros/) !== -1){
      $banner2.style.marginTop = "8vh";
      if(window.location.pathname.search(/cursos/) !== -1 && window.innerWidth < 1024){
        $cursos.style.marginTop = "8vh";
      }
      if(window.location.pathname.search(/diplomados/) !== -1 && window.innerWidth < 1024){
        $cursos.style.marginTop = "8vh";
      }
      if(window.location.pathname.search(/especializaciones/) !== -1 && window.innerWidth < 1024){
        $cursos.style.marginTop = "8vh";
      }
      if((window.location.pathname.search(/libros/) !== -1 && window.innerWidth < 1024) || (window.location.pathname.search(/boletines/) !== -1 && window.innerWidth < 1024)){
        boletinesArray.forEach((boletin) => {
          boletin.style.marginTop = "8vh";
        })
      }
    }
    if(window.location.pathname.search(/cursos\/[^\/?]+/) !== -1 || window.location.pathname.search(/diplomados\/[^\/?]+/) !== -1 || window.location.pathname.search(/especializaciones\/[^\/?]+/) !== -1){
      $curso.style.marginTop = "8vh"
    }
    if(window.location.pathname.search(/anuncios\/[^\/?]+/) !== -1 || window.location.pathname.search(/boletines\/[^\/?]+/) !== -1 || window.location.pathname.search(/libros\/[^\/?]+/) !== -1){
      $main.style.marginTop = "8vh"
    }
  }else{
    $main_nav.classList.remove('flight');
    $hamburguer.classList.remove('flight');
    //Distancia top inicial o sea 100% o sea todo el tamaño del header
    $overlay.style.top = 'initial';
    $overlay.style.height = `100vh`;


    if(window.location.pathname === '/'){
      $hero.style.marginTop = "0rem";
    }

    if(window.location.pathname.search(/consultorias/) !== -1 || window.location.pathname.search(/quienes\-somos/) !== -1 || window.location.pathname.search(/nuestra\-experiencia/) !== -1 || window.location.pathname.search(/nuestros\-servicios/) !== -1 || window.location.pathname.search(/formas\-de\-pago/) !== -1 || window.location.pathname.search(/contacto/) !== -1 || window.location.pathname.search(/publicidad/) !== -1){
      $banner.style.marginTop = "0rem";
      if(window.location.pathname.search(/consultorias/) !== -1 && window.innerWidth < 1024){
        $main.style.marginTop = "0rem";
      }
      if(window.location.pathname.search(/publicidad/) !== -1 && window.innerWidth < 1024){
        $main.style.marginTop = "0rem";
      }
      if(window.location.pathname.search(/formas\-de\-pago/) !== -1 && window.innerWidth < 1024){
        $formas_de_pago.style.marginTop = "0rem";
      }
      if(window.location.pathname.search(/contacto/) !== -1 && window.innerWidth < 1024){
        $contact.style.marginTop = "0rem";
      }  
      if(window.location.pathname.search(/quienes\-somos/) !== -1 && window.innerWidth < 1024){
        $quienes_somos.style.marginTop = "0rem";
      } 
      if(window.location.pathname.search(/nuestra\-experiencia/) !== -1 && window.innerWidth < 1024){
        $nuestra_experiencia.style.marginTop = "0rem";
      } 
      if(window.location.pathname.search(/nuestros\-servicios/) !== -1 && window.innerWidth < 1024){
        $nuestros_servicios.style.marginTop = "0rem";
      }   
    }

    if(window.location.pathname.search(/cursos/) !== -1  || window.location.pathname.search(/diplomados/) !== -1 || window.location.pathname.search(/especializaciones/) !== -1 || window.location.pathname.search(/boletines/) !== -1 || window.location.pathname.search(/libros/) !== -1){
      $banner2.style.marginTop = "0rem";
      if(window.location.pathname.search(/cursos/) !== -1  && window.innerWidth < 1024){
        $cursos.style.marginTop = "0rem";
      }
      if(window.location.pathname.search(/diplomados/) !== -1 && window.innerWidth < 1024){
        $cursos.style.marginTop = "0rem";
      }
      if(window.location.pathname.search(/especializaciones/) !== -1 && window.innerWidth < 1024){
        $cursos.style.marginTop = "0rem";
      }
      if((window.location.pathname.search(/libros/) !== -1 && window.innerWidth < 1024) || (window.location.pathname.search(/boletines/) !== -1 && window.innerWidth < 1024)){
        boletinesArray.forEach((boletin) => {
          boletin.style.marginTop = "0rem";
        })
      }
    }
    if(window.location.pathname.search(/cursos\/[^\/?]+/) !== -1 || window.location.pathname.search(/diplomados\/[^\/?]+/) !== -1 || window.location.pathname.search(/especializaciones\/[^\/?]+/) !== -1){
      $curso.style.marginTop = "0rem"
    }
     if(window.location.pathname.search(/anuncios\/[^\/?]+/) !== -1 || window.location.pathname.search(/boletines\/[^\/?]+/) !== -1 || window.location.pathname.search(/libros\/[^\/?]+/) !== -1){
      
      $main.style.marginTop = "0rem"
    }
   
  }
  
  //Nosotros Section
  if(window.location.pathname === '/'){
    if($nosotros.getBoundingClientRect().top < window.innerHeight / 1.2){
      animateNosotrosItemsArray.play();
    }else{
      animateNosotrosItemsArray.restart();
      animateNosotrosItemsArray.pause();
    }

    // if($anuncios.getBoundingClientRect().top < window.innerHeight / 1.2){
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
appearContentsArray.forEach(content => {
  const top = content.getBoundingClientRect().top;
  if(top < window.innerHeight / 1.2){
        content.classList.add("intro-appear");
  }else{
        content.classList.remove("intro-appear");
  }
})




