require('../models/task');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uuid = require('node-uuid');  

Task = mongoose.model('Task');

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

//  Create a new Task
const newTask = function(req, reply){

  const newTask = req.payload;

  Task.create(newTask, function(err, task){
    if (err){
      return err;
    }else{
      reply(task);
    }
  });

};

const updateTask = function(req, reply){
  const newtask = req.payload;
  console.log(req.payload);
  console.log(req.params.id);
  console.log(Task.find({_id:req.params.id}).name);



  Task.findById({_id:req.params.id}, function(err, task){
    if (err){
      console.log('NOT FOUND');
      reply(err);
    }else{
      if (!task){
        return reply('The page was not found').code(404);
      }

      if (task.state == 'complete'){
        return reply('Task '+ task._id+' exists but is already in a COMPLETE state').code(400);
      }


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

      if (!task){
        return reply('The page was not found').code(404);
      }

      reply(task);
    }
  });

};


module.exports = {
  allTasks: allTasks,
  newTask: newTask,
  updateTask: updateTask,
  deleteTask: deleteTask
}
