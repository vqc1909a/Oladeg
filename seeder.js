//Aqui utilizamos dotenv xq no los estamos ejeecutando dentro del server donde instanciamos el dotenv
import colors from "colors";
//!Models
import Category from "./models/CategoryModel.js";

//!Data
import categories from "./data/categories.js";

//!DB
import { connectDB } from "./config/db.js";


const importData = async () => {
    try{
        await Promise.all([Category.destroy({where: {}})])
        await Category.bulkCreate(categories);

        console.log('Data Imported!'.green.inverse);
        process.exit(0);
    }catch(err){
        console.log(`${err}`.grey.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try{
        await Promise.all([Category.destroy({where: {}})])
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