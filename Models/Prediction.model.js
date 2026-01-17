const mongoose = require('mongoose');

const PredictionSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FemaleUser",
    },
    nextPeridodDate:{
        type:Date
    },
    fertileWindowStart:{
        type: Date
    },
    fertileWindowEnd:{
        type:Date
    },
    confidence:{
        type:Number
    },

},
{
    timeStamps: true
}
);

const Prediction = mongoose.model("PredictionSchema",PredictionSchema);

module.exports = Prediction