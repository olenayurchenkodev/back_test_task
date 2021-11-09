let {Schema, model, Types} = require(`mongoose`)

const schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: String},
    profiles: [{type: Types.ObjectId, ref: 'Profile'}]
})

module.exports = model('User', schema)

