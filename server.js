const Hapi = require('hapi');
const server = new Hapi.Server();

// Create a server with a host and port
server.connection({port : process.env.PORT ||3000 })

// Add the route
server.route({
	method:'GET',
	path: '/',
	handler: function(request, response){
		response('To-do List');
	}
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:'+server.info.uri);
});