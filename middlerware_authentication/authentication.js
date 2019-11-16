const jwt = require("jsonwebtoken");
const config = require("config");
const JWT_SECRET = process.env.JWT_SECRET || config.get("JWT_SECRET");
const Student =  require('../models/usersignup.model')
const Job = require('../models/jobaddition.model')
const Company = require('../models/companyadd.mode')

//here we are just checking that the incoming token coming from header is valid or not. if valid
//we are just passing student

const studentAuth = (req, res, next) => {
    const incomingToken = req.header("x-auth-header");
    if (!incomingToken) {
      return res.status(400).send({
        success: false,
        message: "There is No Token For Authentication"
      });
    }
  
    try {
      const decodedIncomingToken = jwt.verify(incomingToken, JWT_SECRET);
      const userexist = Student.findOne({ _id: decodedIncomingToken.student._id });
  
      if (!userexist) {
        return res.status(400).send({
          success: false,
          message: "Invalid Incomming Token"
        });
      }
  
      req.student = decodedIncomingToken.student;
      next();
    } catch (error) {
      return res.status(500).send({
        success: false,
        error: "Token is not valid"
      });
    }
  };

  module.exports = {
      studentAuth
  }