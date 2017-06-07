const mongoose = require('mongoose');
const uuid = require('node-uuid'); 

Schema = mongoose.Schema;

const taskSchema = Schema({

   _id: { 
    type: String, 
    default: uuid.v1 
  },
  name:{
    type: String,
  },
  state:{
    type: String,
    default: 'INCOMPLETE' 
  },
  description:{
    type: String,
  },
  dateAdded:{
    type: Date,
    default: Date.now
  },
  _creator:{
    type: Number,
    ref: 'User'
  }
  
});

const Task = mongoose.model('Task', taskSchema);