const router = require('express').Router();
let Company = require('../models/companyadd.mode');
let User = require('../models/usersignup.model')
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
JWT_SECRET = "kumailsecretkey"
const uuid = require('uuid');



router.get('/',(req, res) => {
  Company.find()
    .then(companies => res.json(companies))
    .catch(err => res.status(400).json('Error: ' + err));
});

//company getting signed up

const happyJoiSignupSchema = Joi.object({
  companyname: Joi.string().required(),
  companyemail : Joi.string().required(),
  companypassword : Joi.string().required(),
})

router.post('/add',async (req,res)=>{
  let{
    companyname,
    companyemail,
    companypassword,

  } = req.body

  if(!companyemail){
    return res.send({
      message : "Please Fill Email"
    })
  }
  if(!companyname){
    return res.send({
      message : "Must Fill Username"
    })
  }
  if(!companypassword){
    return res.send({
      message : "Password is requried"
    })
  }
  companyemail = companyemail.toLowerCase();
  companyemail = companyemail.trim();

  const emailformatting = companyemail.split("@");
  if (emailformatting.length < 2) {
    return res.send({
      success: false,
      message: "Format of Email is Wrong"
    });
  }

  try{
   const companyexist = await Company.findOne({companyemail})

if(companyexist){
  
  return res.send({
message : "Company Already Exist"
  })
}
companyname = companyname.trim()

const { error } = happyJoiSignupSchema.validate({
  companyname,
  companyemail,
  companypassword,
  
});
if(error){
  res.send({
    message : error.details[0].message
  })
}

const company = await new Company({
 companyname,
 companyemail,
});
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(companypassword, salt);
company.companypassword = hash;

 await company.save();
 const payload = {
  company: {
    companyemail,
    _id: company._id
  }
};
const token = await jwt.sign(payload, JWT_SECRET, {
  expiresIn: "365d"
});
return res.status(200).send({
  message : "Company Added",
  company,
  token
})

  }
  catch{
res.send({
 message : "Internal Error"
})
  }
}
)
const happyJoiloginSchema = Joi.object({
  
  companyemail : Joi.string().required(),
  companypassword : Joi.string().required(),
})
//company login route
router.post("/login", async (req, res) => {
  let { companyemail, companypassword } = req.body;
  if (!companyemail) {
    return res.send({
      success: false,
      message: "Please enter the email address"
    });
  }
  companyemail = companyemail.toLowerCase();

  const { error } = happyJoiloginSchema.validate({
    companypassword,
    companyemail
  });
  if (error) {
    return res.send({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    
    const company = await Company.findOne({ companyemail });
   
    if (!company) {
      
      return res.send({
        success: false,
        message: "login failed check your email"
      });
    }

    const isMatch = await bcrypt.compare(companypassword, company.companypassword);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid Password"
      });
    }

    // creating jsonwebtoken
    const payload = {
      company: {
        companyemail: company.companyemail,
        _id: company._id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).send({
      success: true,
      message: "Company logged-in successfully",
      company,
      token
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Internal server error"
    });
  }
});

//getting specific user for company viewing student

router.get('/student/:id',(req, res, next)=> {
  var id = req.params.id; 
  User.findById(id, (err, user)=>{
   res.json({
    user
   });
  });
  
 })


///res.send aik dafa hoga javascript k thoriugh conditions lgaigai


module.exports = router;