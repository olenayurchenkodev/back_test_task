import express = require('express')
const auth = require('../middleware/auth.middleware')
const bcrypt = require(`bcrypt`)
const {Router} = require(`express`)
const jwt = require(`jsonwebtoken`)
const {check, validationResult} = require(`express-validator`)
const User = require(`../models/User`)
const router = Router()

declare module "express" {
    export interface Request {
        user: any
    }
}

// /auth/registration
router.post(`/register`,
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Unreliable password').isLength({min: 6})
    ],
    async (req: express.Request, res: express.Response)=>{
    try{
        console.log(req.body)
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Incorrect data registration"
            })
        }
        const {username, email, password, isAdmin} = req.body
        console.log('admin status', isAdmin)
        const candidate = await User.findOne({email})
        if (candidate){
            res.status(400).json({message: "Already have this user"})
        }
        const hashPass = await bcrypt.hash(password, 12)
        const user = new User({username, email, password: hashPass, isAdmin})
        await user.save()
        res.status(201).json({message:"User registered"})
        console.log("User registered")

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

// /auth/login
router.post(`/login`,
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Incorrect password').exists()
    ],
    async (req: express.Request, res: express.Response)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Incorrect data log"
            })
        }
        // console.log('request to server for user', req.body)
        const {email, password} = req.body
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({message: "User not defined"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.status(500).json({message: "incorrect password, try again"})
        }

        const token = jwt.sign(
            {userId: user.id},
            "some secret string",
            {expiresIn: '30d'}
        )
        const isAdmin = user.isAdmin
        // console.log('from db',isAdmin)

        res.json({token, userId: user.id, isAdmin})

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

router.get('/home', auth, async (req: express.Request, res: express.Response) => {
    try{
        // console.log("in function",req.user.userId)
        const user = await User.findOne({_id: req.user.userId})
        // console.log(user)
        res.json(user.username)

    } catch (e){
        res.status(500).json("smth wrong")
    }
})

module.exports = router