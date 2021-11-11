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
        console.log(req.body)
        const {name, gender, birthdate, city} = req.body
        const profile = new Profile({
            name, gender, birthdate, city, owner: req.user.userId
        })
        const user = await User.findOne({_id: req.user.userId})
        await User.findOneAndUpdate({_id: req.user.userId}, { profileNum: user.profileNum+1}, {new: true});
        console.log(user)

        await profile.save()
        res.status(201).json({profile})
        console.log('profile made')

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.delete('/', auth, async (req: express.Request, res: express.Response)=>{
    try{
        await Profile.deleteOne({_id: req.body.key})

        const user = await User.findOne({_id: req.user.userId})
        await User.findOneAndUpdate({_id: req.user.userId}, { profileNum: user.profileNum-1}, {new: true});

        res.status(201).json('profile deleted')

    }catch (e) {
        res.status(500).json("cannot delete")
    }
})

router.get('/', auth,  async (req: express.Request, res: express.Response) => {
    try{
        const profiles = await Profile.find({owner: req.user.userId})
        res.json(profiles)
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.get('/:id', auth,  async (req: express.Request, res: express.Response) => {
    try{
        const profiles = await Profile.find({owner: req.params.id})
        console.log(profiles)
        res.json(profiles)
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

module.exports = router
