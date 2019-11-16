const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  jobtitle: {
    type: String,
    required: true,
  },
  qualification :{
 type: String,
  },
  experience :{
    
    type: String
  },
  companyemail :{
    
    type:String
  },
  salaryrange :{
    
    type:String
  },
  companyname :{
    type :String
  },
  companyid:{
    type : String
  },
  applicants :  {
type :  Array
  }
},
 {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;