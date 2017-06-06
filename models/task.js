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
    required: true
  },
  state:{
    type: String,
    required: true  
  },
  description:{
    type: String,
  },
  dateAdded:{
    type: Date,
    default: Date.now
  }

});

const Task = mongoose.model('Task', taskSchema);