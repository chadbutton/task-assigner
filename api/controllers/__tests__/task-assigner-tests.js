
const agent = require('../../models/agent');
const task = require('../../models/task'); 
const agentSkill = require('../../models/agent-skill'); 
const agentTaskController = require('../agent-task-controller');

describe("Task Assigner agent selection rule 1", () => {
    test("It should select agent who has all skills required by the task ", async (done) => {
        let task = require('../../data/task');
        let agents = require('../../data/agents');

        var selectedAgents = agentTaskController.agentsWithAllSkillsFrom(agents, task);
        expect(selectedAgents).toEqual(expect.arrayContaining([agents[1], agents[3]]));
        done();
    });
});

describe("Task Assigner agent selection rule 2", () => {
    test("It should exclude agents already working on a task of equal or higher priority. ", async (done) => {
        let task = require('../../data/task');
        let agents = require('../../data/agents');

        var selectedAgents = agentTaskController.excludeAgentsOnTaskWithHigherPriority(agents, task);
        expect(selectedAgents).toEqual(expect.not.arrayContaining([agents[4], agents[5]]));
        done();
    });
});

describe("Task Assigner agent selection rule 3", () => {
    test("It should return agents without a current task assigned ", async (done) => {
        let agents = require('../../data/agents');

        var selectedAgents = agentTaskController.agentsWithNoTask(agents);
        expect(selectedAgents).toEqual(expect.not.arrayContaining([agents[0], agents[1], agents[2], agents[3]]));
        done();
    });
});

describe("Task Assigner agent selection rule 4", () => {
    test("It should prioritize agents based on current task start time", async (done) => {
        let agents = require('../../data/agents');
        
        var selectedAgents = agentTaskController.prioritizeAgentsByLowPriorityAndMostRecentStartTime(agents);
        expect(selectedAgents[0].id).toEqual('TSR007'); //low priority and most recent
        expect(selectedAgents[1].id).toEqual('TSR006'); //low priority and 3rd most recent
        expect(selectedAgents[2].id).toEqual('TSR005'); //has more recent start time than TSR006 but has high priorty
        done();
    });
});