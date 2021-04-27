export const stringToUrl = (texto) => {
   let textoArray = texto.split('');

   let textoArrayNuevo = textoArray.map((caracter) => {
     if(caracter === " "){
      return "%20"
     }
     return caracter
   })
   return textoArrayNuevo.join('');
}