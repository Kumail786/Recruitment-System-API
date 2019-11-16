const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    companyemail :{
      type: String,
      required: true,
      trim: true,
    },
    companypassword:{
      type:String,
      required : true
    },
    companyprofile :{
      type : Object,
    },
  }, {
    timestamps: true,
  });
  
  const Company = mongoose.model('Company', CompanySchema);
  
  module.exports = Company;