
export const establecerTokenPassword = async (user, token) => {
    //Establecemos una hora para la expiración del token
    let fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);
    user.tokenPassword = token;
    user.expiraToken = fechaExpiracion;
    await user.save();
}

