const mongoose = require("mongoose");

const CycleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FemaleUser",
        required: true,
        unique: true
    },
    lastPeriodDate:{
        type: Date,
        required: true
    },
    cycleLength:{
        type: Number,
        required: true
    },
    periodLength:{
        type:Number,
        required: true
    },
    symptoms:[String],
    mood: String,
    notes: String
},
{
    timestamps : true
});

const Cycle = mongoose.model("CycleSchema",CycleSchema);

module.exports = Cycle;