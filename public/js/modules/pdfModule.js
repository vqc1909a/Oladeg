import {
  canvas,
  button_pdf_prev,
  button_pdf_next
} from '../dom';

import axios from "axios";

if(window.location.pathname.slice(0, 7) === '/libro/'){
  let url = window.location.pathname.slice(7);
  let url_pdf;
  (async () => {
    const {data} = await axios.get(process.env.BACKEND_URI + '/biblioteca-digitals');
    let libro = data.find((dat) => dat.Url === url );
    url_pdf = libro.Libro ? process.env.BACKEND_URI + libro.Libro.url : '';
    if(url_pdf){
      let pdfDoc = null;
      let pageNum = 1;
      let numPages;
      let scale = .5
      if (window.innerWidth >= 764){
        scale = .8;
      }
      //Render the page
      const renderPage = num => {
        //Get Page
        pdfDoc.getPage(num).then(page => {
          //Set Scale
          let viewport = page.getViewport({scale});
          let context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let renderCtx = {
            canvasContext: context,
            viewport
          }
          page.render(renderCtx).promise.then(() => {
              console.log('Page rendered');
          });
          // Output current page;
          document.querySelector("#page-num").textContent = num;
        })
      }

      //Get Document
      pdfjsLib.getDocument(url_pdf).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        numPages = pdfDoc.numPages
        document.querySelector("#page-count").textContent = numPages ;
        renderPage(pageNum);
      })
      .catch((err) => {
        console.log(err.message);
      });

      button_pdf_prev.addEventListener('click', () => {
        pageNum -= 1;
        if(pageNum < 1 ){
          pageNum = 1;
          return null;
        }
        renderPage(pageNum);
      });

      button_pdf_next.addEventListener('click', () => {
        pageNum += 1;
        if(pageNum > numPages){
          pageNum = numPages;
          return null;
        }
        renderPage(pageNum);
      })
    }    
  })();
}