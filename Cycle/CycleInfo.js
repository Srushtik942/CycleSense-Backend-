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


// Get User Cycle

router.get("/me/:id",async(req,res)=>{
    try{
        const userId = req.params.id;
        const response = await Cycle.findOne({userId: userId});
        console.log(response);

        if(!response){
            return res.status(404).json({error:"Cycle data hasn't updated or provided yet."});
        }

        res.status(200).json({message:"Data Fetched successfully!",response})

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// /cycles/me

router.delete("/me/:id",async(req,res)=>{
    try{
        const id = req.params.id;

        const response = await Cycle.findByIdAndDelete({_id:id});

        if(!response){
            return res.status(404).json({error:"User is not found with this id!"})
        }

        res.status(200).json({message:"Data deleted successfully!"});

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// GET /predict/next-period

router.get("/predict/next-period/:id",async(req,res)=>{
    try{
        const userId = req.params.id;
        // console.log(id, typeof id);

        const response = await Cycle.findOne({userId:userId});
        console.log(response);

        if(!response){
            return res.status(404).json({error:"User is not present"})
        }

        const { lastPeriodDate, cycleLength } = response;
        console.log("lastPeriodDate",lastPeriodDate);
        console.log("cycleLength",cycleLength);


         if (!lastPeriodDate || !cycleLength) {
      return res.status(400).json({
        error: "Insufficient data to predict next period",
      });
    }

    // prediction
    const cycleDays = Number(cycleLength);

const nextPeriodDate = new Date(
  new Date(lastPeriodDate).getTime() +
    cycleDays * 24 * 60 * 60 * 1000
);


      res.status(200).json({
      message: "Next period predicted successfully",
      lastPeriodDate,
      cycleLength,
      nextPeriodDate,
    });

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})




module.exports = router