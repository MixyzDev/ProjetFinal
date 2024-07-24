const mongoose = require("mongoose")
const userModel = require("./userModel")

const activitySchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Le titre est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,;:!?()&" -]+$/

            },
            message: "Entrez un titre valide"
        },
    },
})

activitySchema.pre("save", async function (next) {
    await userModel.updateOne(
        {
            _id: this._user
        },
        {
            $addToSet: { activity: this._id }
        })
        next()
})

const activityModel = mongoose.model("activities", activitySchema)
module.exports = activityModel