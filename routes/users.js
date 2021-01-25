var express = require('express')
var router = express.Router()
const {User , Todo} = require('../models/model')


/////USERS ROUTES
///Get All Logged in Users 
router.get('/', async (req, res) =>{
    const LoggedInUsers = await User.find({ loggedIn: true}, 'firstname').exec();
    if(LoggedInUsers.length){  ///return list of logged in
      res.send(LoggedInUsers)
    }else{  ///no logged in users
      res.send({message:"no logged in users !"})
    }
  })
  
  ///REGISTER
  router.post('/register', async (req, res) =>{
    const {username,password,firstname} = req.body;
    const FoundUser = await User.find({ username}).exec();
    if(FoundUser.length){  ///already exist
      res.send({error:"username already exists !!"})
      
    }else{  ///unique username
      User.create({ username,password,firstname }, function (err, user) {
        if (err) throw err;
          res.send({message:"user registered successfully !"})
      });
    }
  })
  
  ////LOGIN
  router.post('/login', async (req, res) =>{
    const {username,password} = req.body;
    const FoundUser  = await User.find({ username: username, password: password }).exec();  ;
    if(FoundUser.length){ ///matched user
    //   //make him logged in
      const user = await User.findOneAndUpdate({ username: username }, { loggedIn: true }).exec();
    
      // //get his Todos (instead of population)
      // const latestTodos  = await Todo.find({user:user.id}).exec();
      
      // population of user -_-
      Todo.
      find({ user:user.id }).
      populate('user').
      exec(function (err, todos) {
        if (err) throw err;
          const obj = {
            message: "logged in successfully",
            username: username,
            latestTodos: (todos.length ? todos : 'no todos'),
          }
          res.send(obj)
      });
    }else{
      res.status(401).send({error:"invalid credentials"});
    }
  })
  
  ///MANIPULATE USER with ID
  router.route('/:id')
    .delete((req, res) => {  ///delete user
      const {id} = req.params;
      User.findOneAndDelete({_id:id},(err)=>{
        if(err)
          res.send({message:"User not found"})
        else
          res.send({success:true});
      });
  
    })
    .patch((req, res) => {  ///edit user
      const {id} = req.params;
      const {firstname,age} = req.body;
      User.findOneAndUpdate({ _id: id }, {firstname ,age},{returnOriginal: false},(err,doc)=>{
        if(err || doc === null){
          res.send({message:"User not found"});
        }
        else{
          const obj = {
            message:"user was edited successfully",
            user: doc
          }
          res.send(obj);
        }
          
      });
  })
  
  
  ////LOGOUT
  // router.get('/api/users/logout', (req, res) =>{
  //   const check = logoutUser();
  //   if(check)
  //       res.send("U logged out successfully");
  //   else
  //       res.send("no logged in user !!");
  
  // })

  

  module.exports = router
