const express = require("express")
const getAiInsightController = require("../controller/getAiInsightController")
const authMiddleware = require('../Middleware/Verify');

const router = express.Router();

router.post('/insights',authMiddleware,getAiInsightController);

module.exports = router