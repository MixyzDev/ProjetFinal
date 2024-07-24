const mongoose = require("mongoose") ; // importation de mongoose
const bcrypt = require("bcrypt")

//definition de notre schema de données grace a la mathode de mongoose schema()

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "le nom est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]+$/
            },
            message: "Entrez un nom valide"
        },
    },
    firstname: {
        type: String,
        required: [true, "le prénom est requis"],
    },
    mail: {
        type: String,
        required: [true, "le mail est requis"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v)
            },
            message: "Entrez un mail valide"
        },
    },
    password: {
        type: String,
        required: [true, "le password est requis"],
        validate: {
            validator: function (v) {
                return /^(?=.*\d)(?=.*[A-Z]).{8,}$/.test(v)
            },
            message: "Entrez un mot de passe valide"
        },
    },
    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities'
    }]
})


userSchema.pre("validate", async function (next) {
    try {
        // Vérifier si l'email est unique
        const existingUser = await this.constructor.findOne({ mail: this.mail })
        if (existingUser) {
            this.invalidate("mail", "Cet E-mail est déjà enregistré.") // methode invalidate qui permet de generer une erreur de validation
        }
        next();
    } catch (error) {
        next(error)
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error)
        }
        this.password = hash;
        next();
    })
});

const userModel = mongoose.model('users', userSchema)
module.exports = userModel;