const userRouter = require('express').Router();
const userModel = require('../models/userModel')
const authguard = require('../services/authguard')
const bcrypt = require('bcrypt')

userRouter.get('/main', (req, res) => {
    res.render('../views/pages/main.twig',{
        title: "Where2Meet"
    })
})

userRouter.get('/signin', (req, res) => {
    res.render('../views/pages/signin.twig',{
        title: "Inscription - Bookstore"
    })
})

userRouter.post('/signin', async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.save();
        res.redirect('/login')
    } catch (error) {
        res.render('pages/signin.twig', {
            error: error.errors,
            title: "Inscription - Bookstore"
        })
    }
})

userRouter.get('/login', (req, res) => {
    res.render("pages/login.twig", {
        title: "Connexion - Bookstore"
    })
})

userRouter.post('/login', async (req, res) => {
    try {
        let user = await userModel.findOne({ mail: req.body.mail }) // on cherche l'utilisateur , { password: 0 }
        if (user) {// si il existe
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user
                res.redirect('/dashboard')
            } else {
                throw {password: "Mauvais mot de passe"}
            }
        } else {
            throw { mail: "Cet utilisateur n'est pas enregistrer"}
        }
    } catch (error) {
       res.render("pages/login.twig", {
        title: "Connexion",
        error: error
       })
    }
})

userRouter.get('/dashboard', authguard, async (req, res) => {
    res.render("pages/dashboard.twig" ,
        {
        user: await userModel.findById(req.session.user._id).populate("activity"),
        title: "Connexion"
    })
})

module.exports = userRouter