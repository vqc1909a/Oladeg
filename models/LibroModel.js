import {DataTypes} from "sequelize";
import slug from "slug";
import shortid from "shortid";

import User from "./UserModel.js";
import { sequelize } from "../config/db.js";

const Libro = sequelize.define('Libro', {
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
                msg: 'Por favor ingrese el título del libro'
            },
            notEmpty: {
                msg: 'Por favor ingrese el título del libro'
            }
        }
    },  
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El contenido del libro es obligatorio'
            },
            notEmpty: {
                msg: 'El contenido del libro es obligatorio'
            },
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
                msg: 'El autor del libro es obligatorio'
            },
            notEmpty: {
                msg: 'El autor del libro es obligatorio'
            },
        }
    },
    fechaPublicacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
             msg: 'El año del libro es obligatorio'
            },
            notEmpty: {
                msg: 'El año del libro es obligatorio'
            },
            // isAfter: {
                //Con el new DAte, establezco zona UTC, y para obtener zona horaria pongo toLocaleString si es toda la fecha si es solo date => toLocaleDateString si es solo hora => toLocaleTimeString
                // args: new Date().toLocaleDateString('es', { timeZone: 'America/Lima' }).split("/").reverse().join('/'),
                // args: new Date().toLocaleDateString('es').split("/").reverse().join('/'),
                // msg: 'La fecha debe ser posterior a la actual'
            // }
        }
    },
    archivo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El archivo es obligatorio'
            },
            notEmpty: {
                msg: 'El archivo es obligatorio'
            }
        }
    },
    slug: DataTypes.TEXT,
}, {
    timestamps: true,
    hooks: {
        beforeCreate(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.slug = url;
        },
        beforeSave(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.slug = url;
        },
        beforeUpdate(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.slug = url;
        }
    }
});


Libro.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El usuario del libro es obligatorio'
            },
            notEmpty: {
                msg: 'El usuario del libro es obligatorio'
            }
        }
    }
})
export default Libro;
