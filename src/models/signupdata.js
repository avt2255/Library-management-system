const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/LibraryDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema
const SignupSchema = new Schema({
    login_id:{type:Schema.Types.ObjectId,ref:"login_tb"},
    fullname:{type:String,required:true},
    username:{type:String,required:true},


})

var signupdata = mongoose.model('signup_tb',SignupSchema)
module.exports = signupdata