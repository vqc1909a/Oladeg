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
        type: DataTypes.STRING(60),
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
    portada: {
        type: DataTypes.TEXT,
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
            }
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
}, {
    timestamps: true,
    hooks: {
        beforeCreate(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.titulo = url;
            anuncio.fechaYHora = `${anuncio.fecha}T${anuncio.hora}`;
        },
        beforeSave(anuncio){
            const url = `${slug(anuncio.titulo).toLowerCase()}-${shortid.generate()}`
            anuncio.titulo = url;
            anuncio.fechaYHora = `${anuncio.fecha}T${anuncio.hora}`;        
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
