const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "LeaderBoard",
  },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      position: {
        type: Number,
        default: 99,
      },
    },
    ,
  ],
});
const Classroom = mongoose.model("Classroom", ClassroomSchema);
module.exports = Classroom;
