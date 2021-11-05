import * as mongoose from "mongoose";
const {Schema, model, Types} = require(`mongoose`)

const schema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

export default mongoose.model('User', schema)