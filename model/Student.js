const mongoose = require("mongoose");


const student = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  code:{
    type:String,
    default:""
  }
});
const Student = mongoose.model("Student", student);
module.exports = Student;
