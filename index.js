const express = require('express');
const app = express();
const {initializeDatabase} = require("./DB/db.connect");
initializeDatabase();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const auth = require('./Auth/auth');
const PORT = 3000;

// auth routes

app.use('/auth',auth);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`)
})