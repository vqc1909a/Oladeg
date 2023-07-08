import Sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path: ".env"});

const db = process.env.NODE_ENV === "production" ? process.env.DB_URI : process.env.DB_URI_DEV;
const user = process.env.NODE_ENV === "production" ? process.env.DB_USER : process.env.DB_USER_DEV;
const password = process.env.NODE_ENV === "production" ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_DEV; //El password en local es cualquiera, no le configuramos nada, en producción no se si será lo mismo
const host = process.env.NODE_ENV === "production" ? process.env.DB_HOST : process.env.DB_HOST_DEV;
const port = process.env.NODE_ENV === "production" ? process.env.DB_PORT : process.env.DB_PORT_DEV;

export const sequelize = new Sequelize(db, user, password, {
    host,
    dialect: 'mysql',
    port,
    logging: false, //Deshabilitar creación de tabla en la consola, o sea el CREATE TABLE ....
    //timezone: 'America/Lima'  //Cuando trabajas de manera independiente los campos de fecha y hora no hay ningun problema (Esto esta bien de forma Nacional solo en tu país) pero el problema viene cuando tratas de fusionar ambos y en que zona horaria establecerlo. Para ello es mejor establecer la zona horaria en UTC(Se recomienda utilizar una zona horaria estándar, como UTC, para almacenar las fechas y horas en la base de datos. Luego, al realizar operaciones, se aplican conversiones según la ubicación del usuario para obtener los resultados correctos.
    timezone: '+00:00' // Configuración de la zona horaria UTC
    // Almacenamiento de fechas y horas en UTC: Al guardar fechas y horas en la base de datos, asegúrate de que estén en formato UTC. Puedes utilizar la función new Date() de JavaScript para obtener una fecha y hora en UTC => const fechaActual = new Date(); // Obtiene la fecha y hora actual en UTC

    //  Al mostrar fechas y horas en la interfaz de usuario, puedes utilizar métodos o funciones de conversión para ajustarlas a la zona horaria del usuario. Por ejemplo, en JavaScript puedes utilizar el método toLocaleString() para obtener la representación de fecha y hora en la zona horaria del usuario => const fecha = model.fecha.toLocaleString('es', { timeZone: 'America/Lima' });
    
    //CONCLUSIÓN: GUARDAR FECHAS EN ZONA HORARIA UTC Y CONVERTIR LAS FECHAS EN ZONAS HORARIAS SEGÚN LA ZONAS HORARIA DEL CLIENTE, ESTO SOLAMENTE SI VAS A TRABAJAR CON FECHAS COMPLETAS O SEA FECHA Y HORA INCLUIDAS, PERO SI TRABAJAS DE MANERA INDEPENDIENTE FECHA Y HORA NO HYA PROBLEMA, SE GUARDA LA FECHA Y HORA TAL COMO PONES EN LOS INPUTS, PERO ESO DEL UTC, SIEMPRE HAY QUE PONERLO
});

export const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }catch(err){
        console.error('Unable to connect to the database:', err);
        await sequelize.close() 
        process.exit(1);
    }
}
