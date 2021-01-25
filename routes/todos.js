var express = require('express')
var router = express.Router()
const {User , Todo} = require('../models/model')



///create TODO
router.post('/' , (req, res)=> { //create
    const{user,title,body,tags} = req.body;
    Todo.create({user,title,body,tags}, function (err, doc) {
      if (err) throw err;
        res.send({message:"Todo was added successfully !",doc:doc})
    });
  })
  
  ///api to get all Todos (of specific user)
  router.get('/:userId', (req, res) =>{
    const {user} = req.params;
    Todo.find({user},(err,doc)=>{
      if(err)
        res.send({message:"enter valid userId"})
      else
        res.send(doc.count());
    });
  })
  
  
  ///api to read all todos with filters
  router.get('/', async (req, res) =>{
    let L = 5,S = 0;
    const {limit,skip} = req.query;
    if(limit) L = limit;
    if(skip) S = S;

    const todos = await Todo.find({ }, null, {skip: parseInt(S) ,limit: parseInt(L)}).exec();
    if(todos.length)
      res.send(todos)
    else
      res.send({message:"no available todos"})
  
  })
  
  
  
  ///MANIPULATE Todo with ID
  router.route('/:id')
    .delete((req, res) => {  ///delete todo
      const {id} = req.params;
      Todo.findOneAndDelete({_id:id},(err)=>{
        if(err)
          res.send({message:"Todo not found"})
        else
          res.send({success:true});
      });
    })
    .patch((req, res) => {  ///edit todo
      const {id} = req.params;
      const {title,body,tags} = req.body;
      Todo.findOneAndUpdate({ _id: id }, {title,body,tags},{returnOriginal: false},(err,doc)=>{
        if(err || doc === null){
          res.send({message:"Todo not found"});
        }
        else{
          const obj = {
            message:"Todo was edited successfully",
            user: doc
          }
          res.send(obj);
        }
          
      });
    })
  

module.exports = router
