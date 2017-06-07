const Hapi = require('hapi');
const task = require('./controllers/task');
const Joi = require('joi');
const mongojs = require('mongojs');
const mongoose = require('mongoose');
const database = require('./config/database'); // get db config file

const Inert = require('inert');

const server = new Hapi.Server();  

// Create a server with a host and port
server.connection({
  port : process.env.PORT || 3000 
})

// Connect to the database
database.connect();

// Register bell and hapi-auth-cookie with the server
server.register([require('hapi-auth-cookie'), require('bell'), require('vision'), require('lout'), require('inert')], function(err) {

  //Setup the session strategy
  server.auth.strategy('session', 'cookie', {
    password: 'secret_cookie_encryption_password', //Use something more secure in production
    redirectTo: '/auth/github', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
  });

  //Setup the social Twitter login strategy
  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: 'secret_cookie_encryption_password', //Use something more secure in production
   clientId: '4f69f6de49d329ab61e9',
      clientSecret: '8f586d46e634f90d88adcbdfbf0cdc32723f0eb8',
    isSecure: false //Should be set to true (which is the default) in production
  });

  //Login routes
  server.route({
    method: 'GET',
    path: '/auth/github',
    config: {
      auth: 'github', //<-- use our twitter strategy and let bell take over
      handler: function(request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
        }

        //Just store a part of the twitter profile information in the session as an example. You could do something
        //more useful here - like loading or setting up an account (social signup).
        const profile = request.auth.credentials.profile;

        request.cookieAuth.set({
          twitterId: profile.id,
          username: profile.username,
          displayName: profile.displayName
        });

        return reply.redirect('/');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: 'session', //<-- require a session for this, so we have access to the twitter profile
      handler: function(request, reply) {

        //Return a message using the information from the session
        return reply('Hello, ' + request.auth.credentials.displayName + '!');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      handler: function(request, reply) {
          request.cookieAuth.clear();
    reply('You are logged out now').code(401);
        
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/example',
    config: {
      auth: {
        strategy: 'session'
      },
      handler: function(request, reply) {
       return reply('Success, you can access a secure route!');
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/secret',
    config: {
      auth: 'session', //<-- require a session for this, so we have access to the twitter profile
      handler: function(request, reply) {
        reply('private');
      }
    }
  });

  server.route({
    method: 'GET',  
    path: '/{somethingss*}', 
    config: { 
      handler: {
        directory: {
          path: 'public',
          index: true
        }
      }
    } 
  });

  server.route({  
    method: 'POST',
    path: '/todos',
    handler: task.newTask,
    config: {
      validate: {
        payload: {
          description: Joi.string().min(1).max(50).required(),
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

  server.route({
    method: 'PUT',
    path: '/todos/{id}',
    handler: task.updateTask,
    config:{
      validate: {
        payload: Joi.object({
          description: Joi.string().min(1).max(50),
          state: Joi.string()
        }).min(1)
        
        }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/todos/{id}',
    handler: task.deleteTask
  });
  
  // Start the server
  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});
