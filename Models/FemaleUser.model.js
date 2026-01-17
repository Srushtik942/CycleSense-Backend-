const mongoose = require('mongoose');

const FemaleUserSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type:Number,
        required: true
    },
},
{
    timestamps: true
});

const FemaleUser = mongoose.model("FemaleUser",FemaleUserSchema);
module.exports = FemaleUser;