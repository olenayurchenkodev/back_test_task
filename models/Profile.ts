export {};
let {Schema, model, Types} = require(`mongoose`)

const profile = new Schema({
    name: {type: String, required: true},
    gender: {type: String},
    birthdate: {type: String},
    city: {type: String},
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Profile', profile)