'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TaskSchema = new Schema({
  Created_date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: 'Please include the task name',
    unique : true,
    dropDups: true
  },
  priority: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Priority'
    }],
    default: ['low']
  },
  required_skills: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }]
  },
  agents: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Agent'
    }]
  }
});

module.exports = mongoose.model('Tasks', TaskSchema);