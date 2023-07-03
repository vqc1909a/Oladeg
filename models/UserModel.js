import {DataTypes} from "sequelize";
import bcrypt from "bcryptjs"
import validator from "validator";

import { sequelize } from "../config/db.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Por favor ingrese su nombre'
            },
            notEmpty: {
                msg: 'Por favor ingrese su nombre'
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Por favor ingrese su nombre'
            },
            notEmpty: {
                msg: 'Por favor ingrese su nombre'
            }
        }
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'El correo electrónico debe ser válido'
            },
            notNull: {
                msg: 'El correo electrónico es obligatorio'
            }
        }
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Por favor ingrese su password'
            },
            notEmpty: {
                msg: 'Por favor ingrese su password'
            },
            len: {
                args: [6],
                msg: "El password debe tener al menos 6 carácteres"
            }
        }
    },
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        default: false
    },
    tokenPassword: DataTypes.STRING,
    expiraToken: DataTypes.DATE
}, {
    timestamps: true,
    hooks: {
        beforeCreate(usuario){
            usuario.email = validator.normalizeEmail(usuario.email);
            usuario.password = User.prototype.hashPassword(usuario.password);
        },
        beforeSave(usuario){
            usuario.email = validator.normalizeEmail(usuario.email);
        },
        beforeBulkCreate(usuarios){
            usuarios.forEach((usuario) => {
                usuario.email = validator.normalizeEmail(usuario.email);
                usuario.password = User.prototype.hashPassword(usuario.password);
            })
        }
    }
});


//Metodo para comparar los passwords
User.prototype.comparePassword =  function(password){
    return bcrypt.compareSync(password, this.password);
}

User.prototype.hashPassword = function(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export default User;
