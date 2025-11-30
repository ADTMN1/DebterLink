const JWT = require('jsonwebtoken');

const generateAccessToken =(user)=>{
    // implementation for generating access token

    return jwt.sign({id:user.id,email:user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});
}

const generateRefreshToken= (user)=>{
    // implementation for generating refresh token
    return jwt.sign({id:user.id,email:user.email},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
}

module.exports={generateAccessToken,generateRefreshToken};  