const activityRouter = require('express').Router()
const authguard = require('../services/authguard')
const userModel = require('../models/userModel')
const activityModel = require('../models/activityModel')


activityRouter.get('/addactivity',authguard, async (req, res) => {
    res.render("pages/addactivity.twig", {
        title: "Ajouter une activité",
        user: await userModel.findById(req.session.user._id)
    })
})

activityRouter.post('/addactivity',authguard, async (req, res) => {
    try {
        const activity = new activityModel(req.body);
        console.log(req.body);
        activity._user = req.session.user._id
        await activity.save();
        res.redirect('/dashboard')
    } catch (error) {
        res.render('pages/addactivity.twig', {
            title: "Ajouter une activité",
            user: await userModel.findById(req.session.user._id),
            error: error,
        })
    }
})

activityRouter.get('/deletedactivity/:activityid', authguard, async (req, res) => {
    try {
        await activityModel.deleteOne({ _id: req.params.activityid })
        res.redirect("/dashboard")
    } catch (error) {
        res.render('pages/dashboard.twig', {
            errorDelete: "Un problème est survenu pendant la suppression",
            user: await userModel.findById(req.session.user._id).populate("activity"),
            title: "Dashboard"
        })
    }
})

activityRouter.post("deleteOne", async function(next) {
    const deletedActivityId = this.getQuerry()._id;
    await userModel.updateOne({ activity: { $in: [deletedActivityId]}}, {$pull: {activity: deletedActivityId}})
})

activityRouter.get('/activityupdate/:activityid', authguard, async (req, res) => {
    try {
        let activity = await activityModel.findById(req.params.activityid)
        res.render('pages/addactivity.twig', {
            title: "Modifier une activité",
            user: await userModel.findById(req.session.user._id),
            error: error,
            activity: activity
        })
    } catch (error) {
        res.render('pages/dashboard.twig', {
            errorMessage: "L'activité que vous souhaitez modifier n'existe pas",
            user: await userModel.findById(req.session.user._id),
            title: "Dashboard"
        })
    }
});

module.exports = activityRouter