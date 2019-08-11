const mongoose = require('mongoose');
const Task = mongoose.model('Tasks');

module.exports = { 
    name: 'Task for rule 1', 
    priority: Task.Priorities.High ,
    required_skills: [{ value: 'skill2' }, { value: 'skill3' }],
    agent: null,
    state: Task.States.Idle
};