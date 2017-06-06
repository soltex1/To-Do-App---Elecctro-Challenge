const Hapi = require('hapi');
const server = new Hapi.Server();
const task = require('./controllers/task');
const Joi = require('joi');
const mongojs = require('mongojs');
const mongoose = require('mongoose');
const database = require('./config/database'); // get db config file

// Create a server with a host and port
server.connection({
  port : process.env.PORT || 3000 
})

// Connect to the database
database.connect();

// Routes
server.route({
	method:'GET',
	path: '/',
	handler:  function (request, reply) {
    reply('To-Do Application');
  }
});

server.route({  
  method: 'POST',
  path: '/todos',
  handler: task.newTask,
  config: {
    validate: {
      payload: {
        name: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(50).required(),
        state: Joi.string()
      }
    }
  }
});

server.route({
  method: 'GET',
  path: '/todos',
  handler: task.allTasks,
  config:{
    validate: {
        query: {
           filter: Joi.array().items(Joi.string().valid('complete', 'incomplete')).single(),
           orderBy: Joi.array().items(Joi.string().valid('DESCRIPTION', 'DATE_ADDED')).single()
        }
      }
  }
});


// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:'+server.info.uri);
});