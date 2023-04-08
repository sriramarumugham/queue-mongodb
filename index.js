const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const dotenv=require('dotenv')
const db=require('./config/db');
db();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

app.use('/' , require('./routes/index.js'))

app.listen(8000, ()=>{console.log("App running on port" , 8000);})