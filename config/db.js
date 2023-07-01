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
