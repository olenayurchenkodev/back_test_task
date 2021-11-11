const {Router} = require('express')
const auth = require("../middleware/auth.middleware")
const {check, validationResult} = require(`express-validator`)
const User = require('../models/User')
const Profile = require('../models/Profile')
import express = require('express')
const router = Router()

// /users/update
router.post('/update', auth,
    [
        check('email', 'Wrong email').isEmail()
    ],
    async (req: express.Request, res: express.Response) => {
    try{
        //validation check
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Incorrect data"
            })
        }
        const {id, username, email, isAdmin} = req.body

        //looking for existing email, hash password and save user
        const candidate = await User.findOne({email})
        if (candidate){
            res.status(400).json({message: "Already have this user"})
        }
        const user = await User.findOneAndUpdate({_id: id},
            { username: username, email: email, isAdmin: isAdmin},
            {new: true});

        if (user) {
            res.status(201).json({message:"User updated"})
        }
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

// /users/
router.delete('/', auth, async (req: express.Request, res: express.Response)=>{
    try{
        // make a copy and delete user
        const user = await User.findOne({_id: req.body.key})
        await User.deleteOne({_id: req.body.key})

        // delete all profiles of user
        const profiles = await Profile.find({owner: user._id})
        for (let profile of profiles){
            await Profile.deleteOne({_id: profile._id})
        }

        res.status(201).json('user deleted')

    }catch (e) {
        res.status(500).json("cannot delete")
    }
})

// /users/
router.get('/', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // find all users not admins
        const users = await User.find({isAdmin: 'off'})

        res.json(users)
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

// /users/
router.get('/statistic', auth,  async (req: express.Request, res: express.Response) => {
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


module.exports = router
