const Student = require("../model/Student");
const Classroom = require("../model/Classroom");

const createStudent = async (req, res) => {
  try {
    const { name, age } = req.body;
    let code = generateReferral(6);

    let student = await Student.create({ name, age, code: code });

    let isRoom = await Classroom.findOne({ name: "LeaderBoard" }).populate({
      path: "students",
      model: "Student",
    });

    let position = 99;
    let updatedRoom = {};

    if (isRoom) {
      position += isRoom.students.length + 1;
      updatedRoom = await Classroom.findOneAndUpdate(
        { name: "LeaderBoard" },
        { $push: { students: { student, position: position } } },
        { new: true }
      );
    } else {
      let newRoom = await Classroom.create({
        name: "LeaderBoard",
        students: [],
      });
      updatedRoom = await Classroom.findOneAndUpdate(
        { name: "LeaderBoard" },
        { $push: { students: { student, position: position + 1 } } },
        { new: true }
      );
    }

    return res.status(200).json({ message: "sent" });
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "error" });
  }
};

const generateReferral = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const referr = async (req, res) => {
  try {
    let { code } = req.body;
    console.log(code);

    let leaderboardCollection = await Classroom.findOne({
      name: "LeaderBoard",
    }).populate({
      path: "students",
      populate: {
        path: "student",
        model: "Student",
      },
    })

    let leaderboard = leaderboardCollection.students;
    // console.log(leaderboard)

    // check referral;

    leaderboard.map(async (item, index) => {
      if (item.student.code == code) {
        // let newItem=item;
        // newItem.position=item.position-10;
        // leaderboard[index]=newItem;

        let start = index - 10;
        let end = index - 1;
        let insertItem = item;
        let insertIndex = index;
        let currentPostion = item.position;

        const updateLeaderBoard = async (
          start,
          end,
          leaderboard,
          insertItem,
          insertIndex,
          currentPostion
        ) => {
          if (start >= 0) {
            leaderboard.map((item, index) => {
              if (index >= start && index <= end) {
                item.position += 1;
              }
            });
          }
          insertItem.position -= 10;
          leaderboard[insertIndex] = insertItem;

          //sort and send the leadeBoard;

          function compare(a, b){
            const compareA=a.position;
            const compareB=b.position;
            let compare=0;
            if(compareA>compareB){
                compare=1;
            }
            else if(compareA<compareB){
                compare=-1;
            }
            return compare;
          }

          leaderboard= leaderboard.sort(compare);

          console.log(leaderboard);

          return leaderboard;
        };

        let updatedLeaderBoard = await updateLeaderBoard(
          start,
          end,
          leaderboard,
          insertItem,
          insertIndex,
          currentPostion
        );
        //save the db 
       let newLeaderBoard= await Classroom.updateOne({name: "LeaderBoard"} ,{students:updatedLeaderBoard } , {new: true} );
       
        console.log(newLeaderBoard);
        //save it to the db;
        // send it to socket;
      }
    });

    return res.status(200).json({ student: "students" });
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "error" });
  }
};

module.exports = { createStudent, referr };
