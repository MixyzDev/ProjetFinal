const userModel = require('../models/userModel')

const authguard = async (req, res, next) => {
    try {
        if (req.session.user) {
            let user = await userModel.findOne({ mail: req.session.user.mail })
            if (user) {
                return next()
            }
        }
        throw new Error("Utilisateur non connecté")
    } catch (error) {
        console.error(error.message)
        res.status(401).render("pages/login.twig", {
            title: "Connexion - Bookstore",
            errorAuth: error.message
        })
    }
}

module.exports = authguard