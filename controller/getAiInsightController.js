const Cycle = require("../Models/Cycle.model")
const getCycleInsight = require("../HelperFunction/AiHelperFunction")

 const getAiInsightController = async(req,res)=>{
    try{
        const cycle = await Cycle.findOne({userId: req.user.id});
        console.lo

        if(!cycle){
            return res.status(400).json({
                message:"Please add cycle data first"
            });
        }

        const aiResponse = await getCycleInsight({
            cycleLength : cycle.cycleLength,
            lastPeriodDate: cycle.lastPeriodDate.toDateString(),
            symptoms: cycle.symptoms,
            question: req.body?.question

        })

   res.status(200).json({message:"Insights on your mood!",aiResponse})

    }catch(error){

        res.status(500).json({
            message:"Unable to generate AI insight right now.", error:error.message
        })
    }
}

module.exports = getAiInsightController