const mongoose = require('mongoose');
const Task = mongoose.model('Tasks');

module.exports = [
    {
        id: 'TSR001',
        skills: [{ value: 'skill1' }, { value: 'skill2' }],
        task: null
    },
    {
        id: 'TSR002',
        skills: [{ value: 'skill3' }, { value: 'skill2' }],
        task: null
    },
    {
        id: 'TSR003',
        skills: [],
        task: null
    },
    {
        id: 'TSR004',
        skills: [{ value: 'skill3' }, { value: 'skill2' }, { value: 'skill1' }],
        task: null
    },
    {
        id: 'TSR005',
        skills: [{ value: 'skill3' }, { value: 'skill2' }, { value: 'skill1' }],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.High ,
            required_skills: [{ value: 'skill2' }, { value: 'skill3' }],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-09 01:52:10.980Z',
            updated_at: '2019-08-11 01:52:10.980Z'
        }
    },
    {
        id: 'TSR006',
        skills: [{ value: 'skill3' }, { value: 'skill2' }, { value: 'skill1' }],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.Low ,
            required_skills: [{ value: 'skill2' }, { value: 'skill3' }],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-08 02:22:10.980Z',
            updated_at: '2019-08-10 02:22:10.980Z'
        }
    },
    {
        id: 'TSR007',
        skills: [{ value: 'skill3' }, { value: 'skill2' }, { value: 'skill1' }],
        task: { 
            name: 'Assigned Task', 
            priority: Task.Priorities.Low ,
            required_skills: [{ value: 'skill2' }, { value: 'skill3' }],
            agent: null,
            state: Task.States.Assigned,
            created_at: '2019-08-09 02:22:10.980Z',
            updated_at: '2019-08-11 02:22:10.980Z'
        }
    }
];