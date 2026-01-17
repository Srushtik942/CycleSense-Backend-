const express = require("express");
const router = express.Router();
const Cycle = require('../Models/Cycle.model');
const Verify = require("../Middleware/Verify");


router.post("/add-length",Verify, async(req,res)=>{
    try{
    const {lastPeriodDate, cycleLength, periodLength, symptoms, mood, notes} = req.body;

    if(!lastPeriodDate || !cycleLength || !periodLength ){
        return res.status(404).json({message:"Check the period-length,cycle-length, last period Date"});
    }

    const CycleData = await Cycle.findOneAndUpdate(
        { userId: req.user.id },
         {
          lastPeriodDate,
          cycleLength,
          periodLength,
          symptoms,
          mood,
        notes
         },
         { upsert: true, new: true }
    )

    // await CycleData.save();

    console.log(CycleData);

    res.status(200).json({message:"Data Saved Successfully!", CycleData});

    }catch(error){
        res.status(500).json({message:"Internal Server error",error:error.message});
    }

})


module.exports = router