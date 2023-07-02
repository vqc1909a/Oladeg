export const panelAdministracion = async (req, res) =>{
    try{
        const fechaYHoraActual = DateTime.local();
        //Se formatea a un objetod e javascript
        const fechaYHoraActualFormateado = fechaYHoraActual.toJSDate();

        //Por el momento, solo puedes crear meetis de los grupos que has creado previamente
        //Lo contrario a DESC es el por defecto asi que no es necesario
        const gruposPromise = Group.findAll({where: {userId: req.user.id}, order: [["updatedAt", "DESC"]]});

        //AQUI HAY UN ERRORZASO AL COMPARAR FECHA Y HORA POR SEPARADO, SI QUIERES COMPARAR FECHA Y HORA, TIENES QUE TENER UN UNICO VALOR, Y ESO TENDRÍA QUE HABER VENIDO DE BASE DE DATOS, PERO COMO VINO POR SEPARADO ES IMPOSBILE PORQUE DA PROBLEMAS SI TRATAMOS DE COMPARARLO CONJUTAMENTE, AMBOS TIENEN QUE REPRESENTAR UN UNICO VALOR

        //gte: Mayor o igual que, simplemente haces lo contrario de abajo, por lo de abajo tiene mas sentido
        //AQUI DE IGUAL FORMA TNEDRÍASQUE HACER EL ORDENAMIENTO DE FORAM DESCENDETEN A PARTIR DE UN CAPO QUE CONTENGA UN VALOR UNICO DE FECHA Y HORA JUNOTS (DATETIME), PUEDE SER EL CREATED_AT O UPDATED_AT, ESTO SIEMPRE Y CUANDO NO TENGAMOS OTROS CAMPOS DE FECHA Y HORA, YA QUE ESTOS 2 CAMPOS AL FINAL SON LOS QUE MANDAN 
        const meetisProximosPromise = Meeti.findAll({where: {
                userId: req.user.id, 
                fechaYHora: {[Op.gte]: fechaYHoraActualFormateado}
            }, 
            //Ordenar de la fecha mas cercana a la mas lejana, lo comentado debajo es lo mismo para solamente la ordeación
            // order: [["fechaYHora", "ASC"]]
            order: [["fecha", "ASC"], ["hora", "ASC"]]
        });

        //lt: Menor que
        //eq: Igual
        const meetisAnterioresPromise = Meeti.findAll({where: {
                userId: req.user.id, 
                fechaYHora: {[Op.lt]: fechaYHoraActualFormateado} 
            }, 
            //Ordenar de la fecha mas cercana a la mas lejana
            // order: [["fechaYHora", "ASC"]]
            order: [["fecha", "ASC"], ["hora", "ASC"]]
        });

     
        const [grupos, meetisProximos, meetisAnteriores] = await Promise.all([gruposPromise, meetisProximosPromise, meetisAnterioresPromise])
       
        return res.render("admin/panel", {
            nombrePagina: "Panel de Administracion",
            grupos,
            meetisProximos,
            meetisAnteriores,
            DateTime,
            convertirPrimeraLetraMayuscula,
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.INICIAR_SESION);
    }
}

