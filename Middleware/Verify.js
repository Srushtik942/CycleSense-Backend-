const jwt = require('jsonwebtoken');
const JWT_SECRET = 'JWT_SECRET_KEY';

function verifyToken(req,res, next){
     console.log("AUTH HEADER:", req.headers.authorization);
     const authHeader = req.headers["authorization"];

     if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Access denied."});
     }
       const token = authHeader.split(" ")[1];
     try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

     }catch(error){
        res.status(401).json({message:"Invalid token"});
     }
}

module.exports = verifyToken;

