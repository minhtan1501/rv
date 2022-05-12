const PasswordResetToken = require('../models/passwordResetTokenModel')
const {isValidObjectId} = require("mongoose");
const {sendError} = require("../utils/helper");


exports.isValidPassRestToken = async(req, res, next) => {
    const {token, userId} = req.body;

    if(!token.trim() || !isValidObjectId(userId)) return sendError(res, "Invalid request")

    const resetToken = await PasswordResetToken.findOne({owner:userId});
    if(!resetToken) return sendError(res, "Unauthorized access, Invalid request!")

    const matched = await resetToken.compareToken(token)

    if(!matched) return sendError(res, "Unauthorized access, Invalid request!")

    req.resetToken = resetToken;
    next();
}