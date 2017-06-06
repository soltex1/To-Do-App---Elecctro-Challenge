require('../models/task');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uuid = require('node-uuid');  

Task = mongoose.model('Task');

// Get all tasks
const allTasks = function(req, reply) {
  Task.find((err, docs) => {
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

module.exports = {
  allTasks: allTasks,
  newTask: newTask
}
