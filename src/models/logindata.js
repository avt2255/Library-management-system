const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/LibraryDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const loginSchema = new Schema({
    email:String,
    password:String
})

var LoginData = mongoose.model('login_tb',loginSchema)
module.exports  = LoginData