const router = require('express').Router();
let User = require('../models/usersignup.model');
let Company = require('../models/companyadd.mode')
const config = require("config");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentAuth = require('../middlerware_authentication/authentication')
 
JWT_SECRET = "kumailsecretkey"

/*=========================================getting List of Users===============================================================>*/

router.get('/',(req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

/*=========================================User Sign Up===============================================================>*/
//validation scheme
//hashed password

const happyJoiSignupSchema = Joi.object({
  username: Joi.string().required(),
  email : Joi.string().required(),
  password : Joi.string().required(),
  profile : {
experience : Joi.string(),
qualification : Joi.string(),
marks : Joi.string()
  },
  jobsApplied : Joi.array()
})

router.post('/add',async (req,res)=>{
  let{
    username,
    email,
    password,
    profile,
    jobsApplied,

  } = req.body

  if(!email){
    return res.send({
      message : "Please Fill Email"
    })
  }
  if(!username){
    return res.send({
      message : "Must Fill Username"
    })
  }
  if(!password){
    return res.send({
      message : "Password is requried"
    })
  }
  email = email.toLowerCase();
  email = email.trim();

  const emailformatting = email.split("@");
  if (emailformatting.length < 2) {
    return res.send({
      success: false,
      message: "Format of Email is Wrong"
    });
  }

  try{
   const studentexist = await User.findOne({email})

if(studentexist){
  return res.send({
message : "Student Already Exist"
  })
}
username = username.trim()


const { error } = happyJoiSignupSchema.validate({
  username,
  email,
  password,
profile,
jobsApplied,
  
});
if(error){
  res.send({
    message : error.details[0].message
  })
}

profile = {
  experience : null,
  qualification : null,
  marks : null,
}

const student = await new User({
 username,
 email,
  password,
 profile,
 jobsApplied,
});
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
student.password = hash;

 await student.save();
 const payload = {
  student: {
    email,
    _id: student.id
  }
};
const token = await jwt.sign(payload, JWT_SECRET, {
  expiresIn: "365d"
});
return res.status(200).send({
  message : "Student Added",
  student,
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
  
  email : Joi.string().required(),
  password : Joi.string().required(),
})

/*=========================================Login Student===============================================================>*/
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (!email) {
    return res.send({
      success: false,
      message: "Please enter the email address"
    });
  }
  email = email.toLowerCase();

  const { error } = happyJoiloginSchema.validate({
    password,
    email
  });
  if (error) {
    return res.send({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    const student = await User.findOne({ email });
    if (!student) {
      return res.send({
        success: false,
        message: "login failed check your email"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid Password"
      });
    }

    // creating jsonwebtoken
    const payload = {
      student: {
        email: student.email,
        _id: student._id
      }
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return res.send({
      success: true,
      message: "Student logged-in successfully",
      student,
      token
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Internal server error"
    });
  }
});

//automatic getting user data by using jwt

router.get('/login/:id',(req,res)=>{
  User.findById(req.params.id).then((user)=>{
    res.send(user)})})


 //updating profile object of specific user
 router.post('/update/:id',((req, res)=> {
  User.findById(req.params.id,(err, user)=> {
      if (!user)
          res.status(404).send("data is not found");
      else
          {
            user.profile={
              experience : req.body.experience,
              qualification : req.body.qualification,
              marks : req.body.marks,

            }
          }
          console.log(user.profile)
             user.save().then(user => {
              res.json(user);
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
}));




//student applying for job

router.post('/apply/:id',((req, res)=> {
  User.findById(req.params.id,(err, user)=> {
      if (!user)
          res.status(404).send("data is not found");
      else
          {
            const jobsApplied = user.jobsApplied;
            const newjobapply = req.body.jobid
            
            jobsApplied.push(newjobapply)
            user.jobsApplied=jobsApplied  
          }
          
          
             user.save().then(user => {
              res.json(user);
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
}));
















module.exports = router;