import {DataTypes} from "sequelize";
import slug from "slug";
import shortid from "shortid";

import User from "./UserModel.js";
import { sequelize } from "../config/db.js";

const ProgramaAcademico = sequelize.define('ProgramaAcademico', {
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
                msg: 'Por favor ingrese el título del programa académico'
            },
            notEmpty: {
                msg: 'Por favor ingrese el título del programa académico'
            }
        }
    },  
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripción del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La descripción del programa académico es obligatorio'
            },
        }
    },
    portada: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La imagen del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La imagen del programa académico es obligatorio'
            }
        }
    },
    inversion: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La inversión del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La inversión del programa académico es obligatorio'
            },
            isDecimal: {
                msg: 'La inversión del programa académico debe ser un número válido'
            }
        }
    },
    duración: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La duración del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La duración del programa académico es obligatorio'
            }
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {
             msg: 'La fecha del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La fecha del programa académico es obligatorio'
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
                msg: 'La hora del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La hora del programa académico es obligatorio'
            }
        }
    },
    modalidad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
             notNull: {
                msg: 'La modalidad del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La modalidad del programa académico es obligatorio'
            },
            isIn: {
                args: [["presencial", "virtual", "semipresencial"]],
                msg: "La modalidad del programa académico es obligatorio"   
            }
        }
    },
    inscripcion: {
        type: DataTypes.TEXT,
       
    },
    temario: {
        type: DataTypes.TEXT,
    },
    materiales: {
        type: DataTypes.TEXT,
    },
    promocion: {
        type: DataTypes.TEXT,
    },
    metodologia: {
        type: DataTypes.TEXT,
    },
    expositorNombre: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre del expositor del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'El nombre del expositor del programa académico es obligatorio'
            }
        }
    },
    expositorDescripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripcion del expositor del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'La descripcion del expositor del programa académico es obligatorio'
            }
        }
    },
    expositorImagen: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La imagen del programa académico es obligaotrio'
            },
            notEmpty: {
                msg: 'La imagen del programa académico es obligaotrio'
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


ProgramaAcademico.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El usuario del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'El usuario del programa académico es obligatorio'
            }
        }
    }
})
export default ProgramaAcademico;
