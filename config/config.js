// var config = require('./config.js').get(process.env.NODE_ENV);
require('dotenv').config()

var config = {
  production: {
    database_uri: process.env.mlab_database,
  },
  default: {
    database_uri: process.env.local_database,
  }
}

exports.get = function get(env) {
  return config[env] || config.default;
}
