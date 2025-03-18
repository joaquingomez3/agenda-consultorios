module.exports = (req, res, next) => {
    console.log("esta aunteticado")
    next();
}
function checkeo(req, res, next) {
    if (req.session.logueado) {
        next()
    } else {
        res.render("login")
    }

}

module.exports = checkeo;
//1 despues del login generar jwt y guardar en la cookie (libreria cookie-parcer, jsonwebtoken)
//2 en este archivo recuperar el jwt de la cokie y ver si es valido
//3 si est todo bien hago el next sino redirecciono al login con el mensaje de error 
