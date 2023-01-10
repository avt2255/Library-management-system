const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://arunvt123:Arunvt2255@cluster0.7mjgbld.mongodb.net/LibraryDB?retryWrites=true&w=majority')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    name:{type:String, required:true},
    author:{type:String, required:true},
    img:{type:String, required:true},
    description:{type:String, required:true},

})
var Bookdata  = mongoose.model('bookdata',BookSchema)
module.exports = Bookdata