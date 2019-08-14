'use strict';

// task-assigner controller is the exposed API used to assign agents to a task and to update tasks 

const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('config');

const Agent = mongoose.model('Agents');
const Task = mongoose.model('Tasks');

var getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};

var generateRandomSkillset = function () {
    var skills = _.toArray(Agent.Skills);
    var numSkills = skills.length;
    var endNum = getRandomInt(numSkills);
    var randomSkills = _.slice(skills, 0, endNum == 0 ? 1 : endNum );
    
    return randomSkills;
};

var generateDBTasks = async function (numberOfTasks) {

    var tasks = _.range(1, numberOfTasks);
    console.log('sim-data-factory generated tasks: ' + tasks.length);
    return await Promise.all(_.map(tasks, async function (value, key) {
       
        var randomSkills = generateRandomSkillset();
        let priorities = _.values(Task.Priorities);
        let randomPriority = _.values(Task.Priorities)[getRandomInt(priorities.length)];
        let newTask = new Task({ name: 'Task #' + value, priority: randomPriority, required_skills: randomSkills, agents: [], state: Task.States.Idle });

        return newTask.save();
        
    }));
};

var generateDBAgents = async function (numberOfAgents, tasks) {

    var agents = _.range(0, numberOfAgents);
    console.log('sim-data-factory generated agents: ' + agents.length);
    
    return await Promise.all(_.each(agents, async function (value, key) {
        let randomSkills = await generateRandomSkillset();
        let numPadded = value.toString().padStart(4, 0);
        let randomTask = tasks[getRandomInt(tasks.length-1)];
        let newAgent = new Agent({ id: 'TSR' + numPadded, skills: randomSkills });

        if (randomTask.isAssignable) {
            newAgent.task = randomTask;
            randomTask.agent = newAgent;
            randomTask.state = Task.States.Assigned;
        }
        
        randomTask.save(async function() {
            return newAgent.save();
        });
    }));
};

var generateFakeDBData = async function () {
    var numTasks = getRandomInt(config.get('sim-data.tasks'));
    var numAgents = getRandomInt(config.get('sim-data.agents'));

    console.log('sim-data-factory generating random tasks on db...');
    var tasks = await generateDBTasks(numTasks);
    console.log('sim-data-factory generating agents on db...');
    await generateDBAgents(numAgents, tasks);
    console.log('sim-data-factory done.');
    return;
};

var regenerateAllFakeDBData = async function () {
    console.log('sim-data-factory deleting all agents, skills and tasks on db...');
    return Promise.all([Agent.deleteMany().exec(), Task.deleteMany().exec()]).then(async function () {
        await generateFakeDBData();
    });
};

module.exports = { regenerateAllFakeDBData: regenerateAllFakeDBData };