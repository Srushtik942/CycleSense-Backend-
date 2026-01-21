const express = require('express');
const app = express();
const {initializeDatabase} = require("./DB/db.connect");
initializeDatabase();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const auth = require('./Auth/auth');
const CycleInfo = require('./Cycle/CycleInfo');
const aiRoutes = require('./routes/ai.routes')
const PORT = 3000;

// auth routes

app.use('/auth',auth);

app.use('/cycle',CycleInfo);

app.use("/ai",aiRoutes)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`)
})