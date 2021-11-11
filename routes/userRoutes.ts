const {Router} = require('express')
const auth = require("../middleware/auth.middleware")
const User = require('../models/User')
import express = require('express')
const router = Router()


router.get('/', auth,  async (req: express.Request, res: express.Response) => {
    try{
        const users = await User.find({isAdmin: 'off'})
        res.json(users)
    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.get('/statistic', auth,  async (req: express.Request, res: express.Response) => {
    try{
        const users = await User.find({isAdmin: 'off'})
        if (users){
            res.json(users)
        }
    } catch (e){
        res.status(500).json("smth wrong")
    }
})



module.exports = router