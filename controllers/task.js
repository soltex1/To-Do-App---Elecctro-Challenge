require('../models/task');
require('../models/user');

const mongoose = require('mongoose');

Task = mongoose.model('Task');
User = mongoose.model('User');


// mapping the request query parameters into database columns names
const options_mapping = {
  'DESCRIPTION': ['description', "ascending"],
  'DATE_ADDED': ['dateAdded', "descending"]
}

// return a dictionary with key state in order to be used as a query filter
function exec_filter(query_filter){
  return {'state': query_filter[0]};
};

// return an array of arrays with 2 elements from options_mapping in order to be used as query sort
function exec_sort(query_sort){
 return [[options_mapping[query_sort][0], options_mapping[query_sort][1]]];
};

// Get all tasks
const allTasks = function(req, reply) {

  const query_options = (req.query.filter) ? (exec_filter(req.query.filter)) : {};
  const sort_options = (req.query.orderBy) ? (exec_sort(req.query.orderBy)) : {};

  Task.find(query_options).select('-__v').sort(sort_options).exec((err, docs) => {
    if (err) {
      return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    reply(docs);
  });
};

// Get all tasks
const allTasksByUser = function(req, reply) {

  Task.find({ _creator: req.params.userid}).exec((err, docs) => {
    if (err) {
      return reply(err, 'Internal MongoDB error');
    }
    reply(docs);
  });
};

//  Create a new Task
const newTask = function(req, reply){

  const newTask = req.payload;

  Task.create(newTask, function(err, task){

    if (err){
      return err;
    }else{
      // append this task to the current user authenticathed
      User.findById(newTask._creator, function(req, userFound){
        if (userFound){
          userFound.save();
        }
      });
      reply(task);
    }
  });
};

const updateTask = function(req, reply){

  const newtask = req.payload;
  
  Task.findById({_id:req.params.id}, function(err, task){
    if (err){
      reply(err);
    }else{
      // task doesnt exist, returns code 404
      if (!task){
        return reply('The page was not found').code(404);
      }
      // task exists, but state has value 'complete' so returns code 400
      if (task.state == 'complete'){
        return reply('Task '+ task._id+' exists but is already in a COMPLETE state').code(400);
      }

      // for each new value from req.payload, update task 
      for (var key in newtask){
        task[key] = newtask[key];
      }

      task.save();
      reply(task);
    }
  });
};

const deleteTask = function(req, reply){

  Task.remove({_id:req.params.id}, function(err, task){
    if (err){
      reply(err);
    }else{
      // task doesnt exist
      if (!task){
        return reply('The page was not found').code(404);
      }
      reply(task);
    }
  });
};

// TO-DO, function to add users
const newUser = function(req, reply){
  var aaron = new User({ _id: "1", name: 'User2', age: 100 });

  aaron.save(function (err) {
  if (err) return reply(err);
  
  //var story1 = new Task({
  //  title: "Once upon a timex.",
  //  description: "123",
  //  _creator: aaron._id    // assign the _id from the person
  // });
  
  // story1.save(function (err) {
  //  if (err) return reply(err);
  //  console.log('created: '+story1._creator);
  // });

  // aaron.tasks.push(story1);
  // aaron.save();
  });
};

// get the current authenticathed user
const currentUser = function(req, reply){
  User.findById(req.auth.credentials.id, function(req, userFound){
      reply(userFound);
  });
};

module.exports = {
  allTasks: allTasks,
  newTask: newTask,
  updateTask: updateTask,
  deleteTask: deleteTask,
  newUser: newUser,
  currentUser: currentUser,
  allTasksByUser: allTasksByUser
}
