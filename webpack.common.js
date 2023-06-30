import path from "path"; 
import Dotenv from "dotenv-webpack";
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

export default  {
     entry: path.join(__dirname, "./public/assets/js"),
     output: {
          filename: "[name].bundle.js",
          path: path.join(__dirname, "./public/dist/js"),
          //clean: true //Te Limpia la salida de webpack cada vez que hace una compilacion, esto es jodido si es que en la misma carpeta bundle esta compilando archivos scss
     },
     //! Webpack requiere ciertos modulos para que utilize, asi que le especificamos que modulos queremos utilizar
     module: {
        rules: [
               {
		        //! Especificar que tipo de archivos va a procesar
                    test: /\.js$/,
                    exclude: /node-modules/,
                    use: {
			    //!Especificar que plugin va a utilizar
                         loader: "babel-loader",
                         options: {
                              presets: ['@babel/preset-env']
                         }
                    }
               },
               {
                    //images
               }
          ]
    },
     plugins: [
          new Dotenv()
     ]
}

//Para trabajar con asyn await, simplemente agregamos en nuestro archivos de js, lo siguiente:
// import "core-js/stable";
// import "regenerator-runtime/runtime"; 