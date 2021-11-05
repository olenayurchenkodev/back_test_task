import User from './models/User'
import express = require('express')
const mongoose = require(`mongoose`)
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

//app.use(`/auth`, require('./routes/authRoutes'))

const start = async () =>{
    try{
        await mongoose.connect(`mongodb+srv://olenayurchenkodev:ITop1000OY@cluster0.odlic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        app.listen(PORT, ()=>console.log(`server started on port ${PORT}`))
        app.post('/', async (req: express.Request, res: express.Response) => {
            const {email, password} = req.body
            console.log(req.body)
            const user = await User.create({email, password})
            res.status(200).json(user)
        })
    }
    catch (e: any){
        console.log(e.message)
        process.exit(1)
    }
}

start()