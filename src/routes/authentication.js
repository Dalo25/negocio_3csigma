const express = require('express');
const router = express.Router();
const { checkLogin, noLogueado } = require('../lib/auth')
const userController = require('../controllers/userController');
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const passport = require('passport')

router.get('/registro', noLogueado, csrfProtection, userController.getRegistro)

router.post('/registro', noLogueado, csrfProtection, userController.postRegistro)

router.get('/confirmar/:codigo', noLogueado, csrfProtection, userController.confirmarRegistro)

router.get('/login', noLogueado, csrfProtection, userController.getLogin)

router.get('/restablecer-clave', noLogueado,csrfProtection, userController.getrestablecerClave )

//router.post('/login', noLogueado, csrfProtection, userController.postLogin)

router.post('/login', noLogueado, csrfProtection, passport.authenticate('local.login', {
    failureRedirect: '/login',
    failureFlash: true,
}), (req, res) => {
    console.log(req.user) // Datos de sesión del usuario actual.
    if (req.user.rol == 'Empresa') {
        res.redirect('/')
    } else if (req.user.rol == 'Admin') {
        res.redirect('/admin')
    } else {
        res.redirect('/consultor')
    }
})

/** Cerrar Sesión */
router.get('/logout', checkLogin, userController.cerrarSesion)

/* RUTA + VISTA PARA RESTABLECER LA CLAVE DE LA CUENTA */
router.get('/restablecer-clave', csrfProtection, userController.getrestablecerClave )

/* RUTA + PÁGINA DONDE SE COLOCARÁ LA NUEVA CLAVE DE LA CUENTA */
router.get('/reset-password', noLogueado, csrfProtection, userController.getresetPassword)
    
/* send reset pass link in correo */
router.post('/reset-password-email', userController.resetPassword)

/* update pass to database */
 router.post('/update-password',csrfProtection,userController.updatePassword)

module.exports = router;