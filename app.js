const express = require('express');
// var session = require('express-session')  //i intend to use it but the task was quite hard 
const users = require('./routes/users')
const todos = require('./routes/todos')
const config = require('./routes/config')



const app = express()

////middleware
app.use(config)

///USERS

app.use('/api/users', users)

////TODOS

app.use('/api/todos', todos)







 
app.listen(3000)