import {DataTypes} from "sequelize";
import slug from "slug";
import shortid from "shortid";

import User from "./UserModel.js";
import { sequelize } from "../config/db.js";

const Boletin = sequelize.define('Boletin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Por favor ingrese el título del boletin'
            },
            notEmpty: {
                msg: 'Por favor ingrese el título del boletin'
            }
        }
    },  
    portada: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La imagen de la portada es obligatorio'
            },
            notEmpty: {
                msg: 'La imagen de la portada es obligatorio'
            }
        }
    },
    autor: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El autor del boletin es obligatorio'
            },
            notEmpty: {
                msg: 'El autor del boletin es obligatorio'
            },
        }
    },
    fechaPublicacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
             msg: 'La fecha de publicación del boletin es obligatorio'
            },
            notEmpty: {
                msg: 'La fecha de publicación del boletin es obligatorio'
            },
            // isAfter: {
                //Con el new DAte, establezco zona UTC, y para obtener zona horaria pongo toLocaleString si es toda la fecha si es solo date => toLocaleDateString si es solo hora => toLocaleTimeString
                // args: new Date().toLocaleDateString('es', { timeZone: 'America/Lima' }).split("/").reverse().join('/'),
                // args: new Date().toLocaleDateString('es').split("/").reverse().join('/'),
                // msg: 'La fecha debe ser posterior a la actual'
            // }
        }
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El contenido del boletin es obligatorio'
            },
            notEmpty: {
                msg: 'El contenido del boletin es obligatorio'
            },
        }
    },
    archivo: DataTypes.TEXT,
    slug: DataTypes.TEXT,
}, {
    timestamps: true,
    hooks: {
        beforeCreate(boletin){
            const url = `${slug(boletin.titulo).toLowerCase()}-${shortid.generate()}`
            boletin.slug = url;
        },
        beforeSave(boletin){
            const url = `${slug(boletin.titulo).toLowerCase()}-${shortid.generate()}`
            boletin.slug = url;
        },
        beforeUpdate(boletin){
            const url = `${slug(boletin.titulo).toLowerCase()}-${shortid.generate()}`
            boletin.slug = url;
        }
    }
});


Boletin.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El usuario del boletin es obligatorio'
            },
            notEmpty: {
                msg: 'El usuario del boletin es obligatorio'
            }
        }
    }
})
export default Boletin;
