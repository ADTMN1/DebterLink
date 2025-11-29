const db = require("../../config/db.config");
const {hashPassword,comparePassword} = require("../Utils/hash");

// function to handle user registration
const registerUser = async(req,res)=>{
   
    try{ const {username,email,password}=req.body;
// check if user already exists
const existingUser=await db.query("SELECT * FROM users WHERE email = $1 [email]");
if(existingUser.rows.length>0){
    return res.status(400).json({message:"User already exists"});
}

const hashedpassword= await hashPassword(password);

// insert new user into database
const newUser=await db.query("INSERT INTO user (username,email,password) VALUES ($1,$2,$3) RETURNING *",[username,email,hashedpassword]);

const user = newUser.rows[0];

const AccessToken = generateAccessToken(user);
const RefreshToken = generateRefreshToken(user);


res.status(201).json({message:"user registered successfully",AccessToken,RefreshToken});}
catch(error){
    console.error("Error registering user:",error);
    res.status(500).json({message:"something went wrong try again later"});
}
}
module.exports={registerUser};