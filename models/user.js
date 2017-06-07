const mongoose = require('mongoose');

const userSchema = Schema({

  _id: {
    type: Number
  },
  name:{
    type: String
  },
  password:{
    type: String
  },
  username:{
    type: String
  }, 
  dateAdded:{
    type: Date,
    default: Date.now
  },
  tasks : [{ type: String, ref: 'Task' }]

});

const User = mongoose.model('User', userSchema);