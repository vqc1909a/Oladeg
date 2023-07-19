import {
  $curso_triggers,
  $curso_contents
} from '../dom.js';

const curso_triggers_array = Array.from($curso_triggers);
const curso_contents_array = Array.from($curso_contents);

if(curso_triggers_array.length){
  curso_triggers_array.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      let target = trigger.dataset.target;
      let text = trigger.textContent;
      let span_length = trigger.childNodes;
      let span;
      if(span_length.length >= 1){
        span = span_length[1];
      }

      let trigger_restantes = curso_triggers_array.filter(trigger => trigger.textContent !== text);

      trigger_restantes.forEach((trigger) => {
        trigger.classList.remove("detalles__trigger--active");
      })

      if(trigger.classList.contains("detalles__trigger--active")){
        trigger.classList.remove("detalles__trigger--active");
        if(span){
          span.classList.remove("detalles__span--active");
        }
      }else{
        trigger.classList.add("detalles__trigger--active");
        if(span){
          span.classList.add("detalles__span--active");
        }

      }

      let contents_restantes = curso_contents_array.filter(content => !content.classList.contains(`detalles__content--${target}`));
      let content_search = curso_contents_array.find(find => find.classList.contains(`detalles__content--${target}`));

      contents_restantes.forEach( content => {
        content.classList.remove("detalles__content--active");
      });
      
      if(content_search.classList.contains("detalles__content--active")){
        if(window.innerWidth < 1024){
          content_search.classList.remove('detalles__content--active');
        }
      }else{
          content_search.classList.add('detalles__content--active');
      }
    })
  })
}
