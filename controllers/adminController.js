export const mostrarPanelAdministracion = async (req, res) =>{
    try{
        return res.render("admin/panel", {
            nombrePagina: "Panel de Administracion",
        })
    }catch(err){
        req.flash('error', err.message);
        return res.redirect(ROUTES.INICIAR_SESION);
    }
}

