const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const FemaleUser = require('../Models/FemaleUser.model');

const JWT_SECRET = 'JWT_SECRET_KEY';

// sign up

router.post('/signup',async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and password required"});
        }

        const exists = await FemaleUser.findOne({email});
        if(exists){
            return res.status(409).json({message:"User already exists."});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await FemaleUser({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(200).json({message:"Signup successful",newUser});

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})


router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await FemaleUser.findOne({email});
        console.log(user);

        if(!user){
            return res.status(404).json({message:"user not found!"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({message:"Incorrect password!"});
        }

        // generate token

        const token = jwt.sign({id:user._id, email:user.email}, JWT_SECRET, {expiresIn: '24h'});

        return res.status(200).json({message:"Login Successful",token});

    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }

})

module.exports = router