const {Router} = require('express')
import express = require('express')
const Profile = require('../models/Profile')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

declare module "express" {
    export interface Request {
        user: any
    }
}

// /profile/generate
router.post('/generate', auth, async (req: express.Request, res: express.Response) => {
    try{
        // make new profile in db
        const {name, gender, birthdate, city, userId} = req.body
        const profile = new Profile({
            name, gender, birthdate, city, owner: userId
        })
        // increment counter in user field and save profile
        const user = await User.findOne({_id: userId})
        await User.findOneAndUpdate({_id: userId}, { profileNum: user.profileNum+1}, {new: true})
        await profile.save()

        res.status(201).json({profile})

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.put('/update', auth,
    async (req: express.Request, res: express.Response) => {
        try{
            const {profile_id, name, gender, birthdate, city} = req.body
            //looking for existing email, hash password and save user
            const profile = await Profile.findOneAndUpdate({_id: profile_id},
                { name: name, gender: gender, birthdate: birthdate, city: city},
                {new: true});

            if (profile) {
                res.status(201).json({message:"Profile updated"})
            }
        } catch (e){
            res.status(500).json("smth wrong")
        }
    })

// /profile/
router.delete('/', auth, async (req: express.Request, res: express.Response)=>{
    try{
        // delete profile
        const {profile_id} = req.body
        const profile = await Profile.findOne({_id: profile_id})
        await Profile.deleteOne({_id: profile_id})
        // decrement counter in user
        const user = await User.findOne({_id: profile.owner})
        await User.findOneAndUpdate({_id: user._id}, { profileNum: user.profileNum-1}, {new: true});

        res.status(201).json('profile deleted')

    }catch (e) {
        res.status(500).json("cannot delete")
    }
})

// /profile/
router.get('/', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // get all profiles of user
        const profiles = await Profile.find()
        console.log(profiles)
        res.json(profiles)

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.get('/:id', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // find all users not admins
        const profiles = await Profile.find({_id: req.params.id})
        res.json(profiles)

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

// /profile/:id
router.get('/:id', auth,  async (req: express.Request, res: express.Response) => {
    try{
        // get all profiles of user
        console.log(req.params.id)
        const profiles = await Profile.find({owner: req.params.id})
        console.log(profiles)
        res.json(profiles)

    } catch (e){
        res.status(500).json("smth wrong")
    }
})


module.exports = router
