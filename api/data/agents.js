const mongoose = require('mongoose');
const Task = mongoose.model('Tasks');

module.exports = [
    {
        id: 'TSR001',
        skills: ['skill1', 'skill2'],
        task: null
    },
    {
        id: 'TSR002',
        skills: ['skill3', 'skill2'],
        task: null
    },
    {
        id: 'TSR003',
        skills: [],
        task: null
    },
    {
        id: 'TSR004',
        skills: ['skill3', 'skill2', 'skill1'],
        task: null
    },
    {
        id: 'TSR005',
        skills: ['skill3', 'skill2', 'skill1'],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.High ,
            required_skills: ['skill2', 'skill3'],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-09 01:52:10.980Z',
            updated_at: '2019-08-11 01:52:10.980Z'
        }
    },
    {
        id: 'TSR006',
        skills: ['skill3', 'skill2', 'skill1'],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.Low ,
            required_skills: ['skill2', 'skill3'],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-08 02:22:10.980Z',
            updated_at: '2019-08-10 02:22:10.980Z'
        }
    },
    {
        id: 'TSR007',
        skills: ['skill3', 'skill2', 'skill1'],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.Low ,
            required_skills: ['skill2' , 'skill3'],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-09 02:22:10.980Z',
            updated_at: '2019-08-11 02:22:10.980Z'
        }
    }
];