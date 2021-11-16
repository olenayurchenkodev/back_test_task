import express = require('express')
const mongoose = require(`mongoose`)
const PORT = process.env.PORT || 3001
const cors = require('cors');

const app = express()
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json())

// basic routes
app.use('/auth', require('./routes/authRoutes'))
app.use('/profile', require('./routes/profileRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/statistic', require('./routes/statistic'))

// start function
const start = async () =>{
    try{
        await mongoose.connect(`mongodb+srv://olenayurchenkodev:ITop1000OY@cluster0.odlic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        app.listen(PORT, ()=>console.log(`server started on port ${port}`))
    }
    catch (e: any){
        console.log(e.message)
        process.exit(1)
    }
}

const port = 3001

start()
