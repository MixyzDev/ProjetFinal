const express = require("express") //import de la librarie express
const mongoose = require("mongoose") // import de la librarie mongoose
const session = require("express-session")
const cors = require("cors") // tolere que tu fasse un appel si jamais tu viens de tel url, mon front peut envoyer des fetch, c'est la white list du site.c'est la config des acces au site
const userRouter= require("./routes/userRouter") // nous importons notre router ici
const activityRouter= require("./routes/activityRouter")
require('dotenv').config() 

const port = process.env.PORT // definition du port d'écoute du serveur
const db = process.env.DATABASE_URL

const app = express() //demarage d'une instance d'express.

// middlewhare, fonction intermediaire lue entre un point a et b, c'est du code qui est jouer au milieu, ordre important

app.use(express.static("./public"))
app.use(cors())
app.use(express.json()) //nous demandons ici a express d'analyser nos requetes en json
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'chikaka',
    resave: true,
    saveUninitialized: true,
}))
app.use(userRouter)//nous demandons ici a express d'utiliser notre userRouter, les routes definies dans notre router seront donc disponibles
app.use(activityRouter)

/*
app.listen est une methode d'express , qui permet de specifier un port d'ecoute pour notre application en premier parametre , en deuxieme parametre ,
elle prend une fonction call back qui a pour but d'afficher une erreur si il y en a une , sinon , j'affiche un message de reussite.
*/

app.listen(port,(err)=>{
    if(err){
        console.log(err) ;
    }else{
        console.log(`Vous êtes connecté à W2M`) ;
    }
})

/*
lorsque l'option strictQuery est definie sur true ,
mongoose s'assurera que seuls les champs specifies dans votre schema seront enregistrés
dans la base de données et que tous les autre champs ne seront pas enregistrés
(si d'autre champs sont envoyés)
*/
mongoose.set('strictQuery',true);

/*
mongosse.connect est une methode de mongoose, qui permet de se connecter a notre base de données grace a l'URI que je place en premier paramaetre,
en deuxieme parametre , elle prend une fonction callback qqui a pour but d'afficher une erreur si il y en a une , sinon , j'affiche un message de reussite.
*/

mongoose.connect(db)
console.log("server");