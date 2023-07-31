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
    descripcion: {
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
                msg: 'La imagen de la portada es obligatorio'
            },
            notEmpty: {
                msg: 'La imagen de la portada es obligatorio'
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
            },
            min: {
                args: 1,
                msg: 'Ingrese un valor válido para la inversión del programa'
            }
        }
    },
    duracion: {
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
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
             notNull: {
                msg: 'El tipo del programa académico es obligatorio'
            },
            notEmpty: {
                msg: 'El tipo del programa académico es obligatorio'
            },
            isIn: {
                args: [["curso", "diplomado", "especializacion"]],
                msg: "El tipo del programa académico es obligatorio"   
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre del expositor es obligatorio'
            },
            notEmpty: {
                msg: 'El nombre del expositor es obligatorio'
            }
        }
    },
    expositorDescripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripcion del expositor es obligatorio'
            },
            notEmpty: {
                msg: 'La descripcion del expositor es obligatorio'
            }
        }
    },
    expositorImagen: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La imagen del expositor es obligatorio'
            },
            notEmpty: {
                msg: 'La imagen del expositor es obligatorio'
            }
        }
    },
    certificado: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La imagen del certificado es obligatorio'
            },
            notEmpty: {
                msg: 'La imagen del certificado es obligatorio'
            }
        }
    },
    fechaYHora: DataTypes.DATE,
    slug: DataTypes.TEXT,
}, {
    timestamps: true,
    hooks: {
        //NO olvidar que el new Date lo esta guardando en formato UTC, asi que hace las conversiones necesarias si vas a usar este dato, lo mismo pasa con created_at, updated_at
        beforeCreate(programaAcademico){
            const url = `${slug(programaAcademico.titulo).toLowerCase()}-${shortid.generate()}`
            programaAcademico.slug = url;
            programaAcademico.fechaYHora = new Date(`${programaAcademico.fecha} ${programaAcademico.hora}`);
        },
        beforeSave(programaAcademico){
            const url = `${slug(programaAcademico.titulo).toLowerCase()}-${shortid.generate()}`
            programaAcademico.slug = url;
            programaAcademico.fechaYHora = new Date(`${programaAcademico.fecha} ${programaAcademico.hora}`);
        },
        //No olvidar que antes de actualizar tus datos poner la siguiente propiedad => individualHooks: true,
        beforeUpdate(programaAcademico){
            const url = `${slug(programaAcademico.titulo).toLowerCase()}-${shortid.generate()}`
            programaAcademico.slug = url;
            programaAcademico.fechaYHora = new Date(`${programaAcademico.fecha} ${programaAcademico.hora}`);
        }
    },
    //     Si individualHooks: false, o no se especifica en absoluto (porque false es su valor predeterminado), entonces los ganchos definidos para un evento específico se ejecutarán en una única llamada para todas las operaciones realizadas en una operación en lote.

    // En otras palabras, si tienes una operación en lote que crea, actualiza o elimina varios registros a la vez, los ganchos correspondientes (por ejemplo, beforeCreate, afterCreate, beforeUpdate, afterUpdate, beforeDestroy, afterDestroy, etc.) se agruparán y se ejecutarán una vez para todas las operaciones realizadas en esa operación en lote.

    //Osea si esta en false que es por defecto se ejcuta lo que esta dentor dle hook del tiron o sea solo una vez a la vez para cada uno de lo regisotros, si estuviera en true, sería uno por uno hasta terminar todos los registros

    //Puedes personalizar el comportamiento de cada registro de forma independiente en las operaciones en lote. Esto te permite realizar acciones específicas para cada registro, lo que puede ser útil cuando los registros requieren tratamientos o lógica distintos según sus datos individuales.

    //En resumen, individualHooks: true brinda más flexibilidad y personalización para tratar con registros individuales en operaciones en lote, mientras que individualHooks: false puede mejorar el rendimiento y la eficiencia en operaciones que involucran muchos registros. La elección dependerá de tus necesidades específicas y de cómo desees manejar los ganchos en tu aplicación.
    // individualHooks: false
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
