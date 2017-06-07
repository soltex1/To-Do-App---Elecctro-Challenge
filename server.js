const Hapi = require('hapi');
const task = require('./controllers/task');
const Joi = require('joi');
const mongojs = require('mongojs');
const mongoose = require('mongoose');
const database = require('./config/database'); // get db config file

const Inert = require('inert');

// Connect to the database
database.connect();

let uuid = 1; // Use seq instead of proper unique identifiers for demo only

const users = {
    john: {
        id: '0',
        password: 'password',
        name: 'John Doe'
    },
    john2: {
        id: '1',
        password: 'password',
        name: 'John Doe'
    }
};

const home = function (request, reply) {
    reply('<html><head><title>Login page</title></head><body><h3>Welcome ' +
      request.auth.credentials.name +
      '!</h3><br/><form method="get" action="/logout">' +
      '<input type="submit" value="Logout">' +
      '</form></body></html>');
};

const login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    let message = '';
    let account = null;

    if (request.method === 'post') {

        if (!request.payload.username ||
            !request.payload.password) {

            message = 'Missing username or password';
        }
        else {
            account = users[request.payload.username];
            if (!account ||
                account.password !== request.payload.password) {

                message = 'Invalid username or password';
            }
        }

        console.log(account);
    }

    if (request.method === 'get' ||
        message) {

        return reply('<html><head><title>Login page</title></head><body>' +
            (message ? '<h3>' + message + '</h3><br/>' : '') +
            '<form method="post" action="/login">' +
            'Username: <input type="text" name="username"><br>' +
            'Password: <input type="password" name="password"><br/>' +
            '<input type="submit" value="Login"></form></body></html>');
    }

    const sid = String(++uuid);
    request.server.app.cache.set(sid, { account: account }, 0, (err) => {

        if (err) {
            reply(err);
        }

        request.cookieAuth.set({ sid: sid });
        return reply.redirect('/');
    });
};

const logout = function (request, reply) {

    request.cookieAuth.clear();
    return reply.redirect('/');
};

const server = new Hapi.Server();
server.connection({ port: 8000 });

server.register([require('hapi-auth-basic'), require('hapi-auth-cookie'), require('bell'), require('vision'), require('lout'), require('inert')], function(err) {


    if (err) {
        throw err;
    }

    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: 'password-should-be-32-characters',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: function (request, session, callback) {

            cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
        }
    });

    server.route([{
      method: 'GET',  
      path: '/{somethingss*}', 
      config: { 
        handler: {
          directory: {
            path: 'public',
            index: true
          }
        }
      }},
        { method: 'GET', path: '/home', config: { handler: home } },
        { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
        { method: 'GET', path: '/logout', config: { handler: logout } }
    ]);
  
    server.route({  
    method: 'GET',
    path: '/newuser',
    handler: task.newUser
    
    
  });


  server.route({  
    method: 'GET',
    path: '/currentuser',
    handler: task.currentUser
    
    
  });

  server.route({  
    method: 'POST',
    path: '/todos',
    handler: task.newTask,
    config: {
      validate: {
        payload: {
          description: Joi.string().min(1).max(50).required(),
          state: Joi.string(),
          _creator: Joi.string(),
          _id: Joi.string()
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
             filter: Joi.array().items(Joi.string().valid('COMPLETE', 'INCOMPLETE')).single(),
             orderBy: Joi.array().items(Joi.string().valid('DESCRIPTION', 'DATE_ADDED')).single()
          }
        }
    }
  });

    server.route({
    method: 'GET',
    path: '/todos/{userid}',
    handler: task.allTasksByUser,
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

    server.start(() => {

         console.log('Server running at:', server.info.uri);
    });
});