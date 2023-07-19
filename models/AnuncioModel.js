import {DataTypes} from "sequelize";
import slug from "slug";
import shortid from "shortid";

import User from "../models/UserModel.js";
import { sequelize } from "../config/db.js";

const Anuncio = sequelize.define('Anuncio', {
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
                msg: 'Por favor ingrese el título del anuncio'
            },
            notEmpty: {
                msg: 'Por favor ingrese el título del anuncio'
            }
        }
    },  
    extracto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El extracto del anuncio es obligatorio'
            },
            notEmpty: {
                msg: 'El extracto del anuncio es obligatorio'
            },
            tieneMaximo35Palabras(value) {
                const palabras = value.trim().split(/\s+/);
                if (palabras.length > 35) {
                    throw new Error('El extracto del anuncio debe tener como máximo 35 palabras.');
                }
            }
        }
    },
    portada: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La portada del anuncio es obligaotrio'
            },
            notEmpty: {
                msg: 'La portada del anuncio es obligaotrio'
            }
        }
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripción del anuncio es obligatorio'
            },
            notEmpty: {
                msg: 'La descripción del anuncio es obligatorio'
            }
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
             msg: 'La fecha del anuncio es obligatorio'
            },
            notEmpty: {
                msg: 'La fecha del anuncio es obligatorio'
            },
            // isAfter: {
                //Con el new DAte, establezco zona UTC, y para obtener zona horaria pongo toLocaleString si es toda la fecha si es solo date => toLocaleDateString si es solo hora => toLocaleTimeString
                // args: new Date().toLocaleDateString('es', { timeZone: 'America/Lima' }).split("/").reverse().join('/'),
                // args: new Date().toLocaleDateString('es').split("/").reverse().join('/'),
                // msg: 'La fecha debe ser posterior a la actual'
            // }
        }
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
             notNull: {
                msg: 'La hora del anuncio es obligatorio'
            },
            notEmpty: {
                msg: 'La hora del anuncio es obligatorio'
            }
        }
    },
    fechaYHora: DataTypes.DATE,
    slug: DataTypes.TEXT,
}, {
    timestamps: true,
    hooks: {
        beforeCreate(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.slug = url;
            anuncio.fechaYHora = new Date(`${anuncio.fecha} ${anuncio.hora}`);
        },
        beforeSave(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.slug = url;
            anuncio.fechaYHora = new Date(`${anuncio.fecha} ${anuncio.hora}`);
        }
    }
});


Anuncio.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El usuario del anuncio es obligatorio'
            },
            notEmpty: {
                msg: 'El usuario del anuncio es obligatorio'
            }
        }
    }
})
export default Anuncio;
