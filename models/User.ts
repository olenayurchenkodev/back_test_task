import * as mongoose from "mongoose";
const {Schema, model, Types} = require(`mongoose`)

const schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    status: {type: Boolean},
    links: [{type: Types.ObjectId, ref: 'Link'}]
})

module.exports = model('User', schema)