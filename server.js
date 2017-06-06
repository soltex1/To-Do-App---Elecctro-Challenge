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
	handler: task.allTasks
});

server.route({  
    method: 'POST',
    path: '/api/tasks2',
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

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:'+server.info.uri);
});