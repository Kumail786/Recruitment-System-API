const router = require('express').Router();
const Job = require('../models/jobaddition.model')
const User = require('../models/usersignup.model')

//all jobs
router.get('/',(req, res) => {
    Job.find()
      .then(jobs => res.json(jobs))
      .catch(err => res.status(400).json('Error: ' + err));
  });

//company creating jobs
router.post('/addjob',(req, res)=> {

              const newjob =new Job ({
                jobtitle : req.body.jobtitle,
                experience : req.body.experience,
                qualification : req.body.qualification,
                salaryrange : req.body.salaryrange,
                companyname : req.body.companyname,
                companyid : req.body.companyid,
                applicants : req.body.applicants
              })
            
            
               newjob.save().then(job => {
                res.json(job);
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    })


 //Deleting specific job

 router.delete('/delete/:id',(req,res)=>{
    Job.findOneAndDelete(req.params.id).then((err,job)=>{
        res.json(job)
    })
 })

 //getting all jobs by specific company

router.get('/specific/:id',(req, res, next)=> {
    var id = req.params.id; 
    Job.find({companyid : id}, (err, jobs)=>{
     res.json({
      jobs
     });
    });
    
   })


 //student applying for job
 
 router.post('/specific/apply/:id',(req,res,next)=>{
     var id = req.params.id;
     
     Job.findById(id,(err,job)=>{
        const newApplicant = req.body
         const applicants = job.applicants
         
applicants.push(newApplicant)
job.applicants = applicants
job.save()
console.log(job.applicants)
res.json(job)
         })})


router.get('/checking/:id',(req,res,next)=>{
  User.findById(req.params.id).then(res=>{
    if(res.jobApplied.length > 0){
  res.jobsApplied.map(jobApplied=>{
    
    if(jobApplied == req.body.jobid){
      console.log("you have already applied")
    }
    else{
      
      Job.findById(req,body.jobid,(err,job)=>{
        const newApplicant = req.body
         const applicants = job.applicants
         
applicants.push(newApplicant)
job.applicants = applicants
job.save()
console.log(job.applicants)
res.json(job)
         })
    }
  })}
  })
})


 

         //getting list of all student applied to specific job

  router.get('/applications/:id',(req,res)=>{
    Job.findById(req.params.id,(err,job)=>{
      if(job){
      res.json(job.applicants)
    }
    else if(err){
      throw err
    }
    }
  )
  })    
  
  
//
  router.post('/apply/:id/:jobid',((req, res)=> {
    User.findById(req.params.id,(err, user)=> {
  
        if (!user)
            res.status(404).send("data is not found");
  
  const jobid = req.params.jobid
  
  const jobsapplied = user.jobsApplied
  
  if(jobsapplied.length != 0){
    let a = 0;
  jobsapplied.map(job=>{
  if(job == jobid){
    a++;
  }
  })
  if( a > 0){
    console.log("you cant apply")
  }
  else{
    console.log("you can apply")
  }
  
  }
    })}))













  

    module.exports = router;