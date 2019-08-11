'use strict';

// task-assigner controller is the exposed API used to assign agents to a task and to update tasks 

const mongoose = require('mongoose');
const _ = require('lodash');

const Agent = mongoose.model('Agents');
const AgentSkill = mongoose.model('AgentSkill');
const Task = mongoose.model('Tasks');

var getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
};

var generateRandomSkillset = async function () {
    var skills = _.toArray(AgentSkill.Skills);
    var numSkills = skills.length;
    var firstNum = getRandomInt(numSkills);
    var secondNum = getRandomInt(numSkills);
    var startNum = firstNum <= secondNum ? firstNum : secondNum;
    var endNum = startNum == firstNum ? secondNum : firstNum;
    var randomSkills = _.slice(skills, startNum, endNum);
    
    return await Promise.all(_.map(randomSkills, async function(s) {
        return new AgentSkill({ value: s });
    }));
};

var generateDBTasks = async function (numberOfTasks) {

    var tasks = _.range(1, numberOfTasks);
    return await Promise.all(_.map(tasks, async function (value, key) {
       
        var randomSkills = await generateRandomSkillset();
        let priorities = _.values(Task.Priorities);
        let randomPriority = _.values(Task.Priorities)[getRandomInt(priorities.length)];
        
        let newTask = new Task({ name: 'Task #' + value, priority: randomPriority, required_skills: randomSkills, agents: [], state: Task.States.Idle });
        return newTask.save();
        
    }));
};

var generateDBAgents = async function (numberOfAgents, tasks) {

    var agents = _.range(1, numberOfAgents);
    
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

var generateDBAgentSkills = async function () {
    var agentSkills = [{ value: AgentSkill.Skills.Skill1 }, { value: AgentSkill.Skills.Skill2 }, { value: AgentSkill.Skills.Skill3 } ];
    AgentSkill.create(agentSkills);
};

var generateFakeDBData = async function () {
    var numTasks = getRandomInt(100);
    var numAgents = getRandomInt(20);

    var tasks = await generateDBTasks(numTasks);
    await generateDBAgentSkills();
    return await generateDBAgents(numAgents, tasks);
};

var regenerateAllFakeDBData = async function () {
    return Promise.all([Agent.deleteMany(), AgentSkill.deleteMany(), Task.deleteMany()]).then(async function () {
        await generateFakeDBData();
    });
};

module.exports = { regenerateAllFakeDBData: regenerateAllFakeDBData };