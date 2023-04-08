const router=require('express').Router();

const {createStudent , referr}=require('../controller/studentController');
router.get('/' , (req ,  res)=>{

    return res.send("Api runnig");

});


router.post('/student' , createStudent);
router.post('/referr' , referr)

module.exports=router;