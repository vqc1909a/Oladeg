//Aqui utilizamos dotenv xq no los estamos ejeecutando dentro del server donde instanciamos el dotenv
import colors from "colors";
//!Models
import User from "./models/UserModel.js";

//!Data
import users from "./data/users.js";

//!DB
import { connectDB } from "./config/db.js";


const importData = async () => {
    try{
        await Promise.all([User.destroy({where: {}})])
        await User.bulkCreate(users);

        console.log('Data Imported!'.green.inverse);
        process.exit(0);
    }catch(err){
        console.log(`${err}`.grey.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try{
        await Promise.all([User.destroy({where: {}})])
        console.log('Data Destroyed!'.green.inverse);
        process.exit(0);
    }catch(err){
        console.log(`${err}`.grey.inverse);
        process.exit(1);
    }
}

connectDB().then(() => {
    if(process.argv[2] === '-d'){
        destroyData();
    }else{
        importData();
    }
});