const {Router} = require('express')
const auth = require("../middleware/auth.middleware")
const {check, validationResult} = require(`express-validator`)
const User = require('../models/User')
const Profile = require('../models/Profile')
import express = require('express')
const router = Router()

router.get('/', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // find all users for statistic
        const users = await User.find()

        if (users){
            res.json(users)
        }
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.get('/:id', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // get all profiles of user
        const profiles = await Profile.find({owner: req.params.id})
        res.json(profiles)

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

module.exports = router