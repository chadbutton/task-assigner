'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

//note states are a static list for simplicity, they could be moved into DB if they become dynamic
const States = Object.freeze({
  Idle: 'idle',
  Assigned: 'assigned',
  Completed: 'completed',
});

//note priorities are a static list for simplicity, they could be moved into DB if they become dynamic
const Priorities = Object.freeze({
  Low: 0,
  High: 1
});

var TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Please include the task name',
    unique : true,
    dropDups: true
  },
  priority: {
    type: Number,
    enum: _.values(Priorities),
    default: 0
  },
  required_skills: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'AgentSkill'
    }]
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent'
  },
  state: {
    type: String,
    enum: _.values(States),
    default: 'idle'
  }
});

Object.assign(TaskSchema.statics, {
  States,
  Priorities
});

TaskSchema.virtual('isAssignable').get(function() { return this.agent == null && this.state == 'idle'; });

module.exports = mongoose.model('Tasks', TaskSchema);