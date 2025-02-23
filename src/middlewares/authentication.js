"use strict"

const Token = require("../models/token")
const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const auth = req.headers?.authorization || null // Token...tokenKey... || Bearer...accessToken...
    const tokenKey = auth ? auth.split(" ") : null // ["Token", "...tokenKey..."] || ["Bearer", "...accessToken..."] 

    if (tokenKey)
        //* SIMPLE TOKEN
        if (tokenKey[0] == "Token") {
            const tokenData = await Token.findOne({ token: tokenKey[1] }).populate("userId")
            // console.log(tokenData)
            if (tokenData) req.user = tokenData.userId
        } 
        //* JWT
        else if (tokenKey[0] == "Bearer")
            jwt.verify(tokenKey[1], process.env.ACCESS_KEY, function (error, accessData) {
                console.log(accessData)
                if (accessData) req.user = accessData
            })
    next()
}