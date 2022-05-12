const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendError } = require("../utils/helper");
exports.auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) {
            sendError(res,"Please login or Register");
        }
        const id = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = id;
        next();
    }
    catch(err) {
        res.status(404).json({message:err})
    }
}

exports.admin = async(req, res, next) => {
    try {
        const {id} = req.user
        if(!id) return sendError(res,'Please login or Register')

        const user = await User.findById(id);
        if(!user) return sendError(res,'User not found')

        if(user.role !== 'admin') return sendError(res,'unauthoized access');
        next();

    }
    catch(err) {

    }
}