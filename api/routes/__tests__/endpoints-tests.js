const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../../app');
const simDataFactory = require('../../data/sim-data-factory');
const Task = mongoose.model('Tasks');
const Agent = mongoose.model('Agents');

// setup teardown -----------

beforeAll(async () => {
    await simDataFactory.regenerateAllFakeDBData();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error  
    await mongoose.disconnect();
});

//Error handing tests -----------

describe("GET /blah ", () => {
    test("It should get a 404 not found", async (done) => {
        const response = await request(app).get("/blah")
        expect(response.statusCode).toBe(404);
        done();
    });
});

describe("POST /api/v1/tasks/assign-to-agent no task name provided", () => {
    test("It should get a 400 bad request", async (done) => {
        const response = await request(app).post("/api/v1/tasks/assign-to-agent");
        expect(response.statusCode).toBe(400);
        done();
    });
});

describe("POST /api/v1/tasks/:taskId/mark-completed", () => {
    test("It should get a 404 not found (invalid id)", async (done) => {
        const response = await request(app).post("/api/v1/tasks/999/mark-completed");
        expect(response.statusCode).toBe(404);
        done();
    });
});

describe("POST /api/v1/tasks/:taskId/mark-completed", () => {
    test("It should get a 404 not found (invalid id)", async (done) => {
        const response = await request(app).post("/api/v1/tasks/999/mark-completed");
        expect(response.statusCode).toBe(404);
        done();
    });
});

describe("POST /api/v1/tasks/:taskId/mark-completed ", () => {
    test("It should get a 404 not found if task is not assigned", async (done) => {

        var taskFromDB = await Task.findOne({ state: Task.States.Idle });
        expect(taskFromDB).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));
        const response = await request(app).post("/api/v1/tasks/" + taskFromDB.id + "/mark-completed");

        expect(response.statusCode).toBe(404);
        done();
    });
});

//Expected behavior tests -----------
describe("POST /api/v1/tasks/assign-to-agent", () => {
    test("It should create a new task with name provided and assign to agent", async (done) => {
        const response = await request(app).post("/api/v1/tasks/assign-to-agent").query({ name: 'Take a call', required_skills: ['skill1', 'skill2'] });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            agent: expect.any(Object)
        }));
        expect(response.body).toEqual(expect.objectContaining({
            task: expect.any(Object)
        }));
        expect(response.body.task).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: 'Take a call',
            priority: expect.any(Number),
            required_skills: expect.any(Array),
            state: Task.States.Assigned,
            agent: expect.any(String)
        }));
        expect(response.body.agent).toEqual(expect.objectContaining({
            _id: expect.any(String),
            created_at: expect.any(String),
            id: expect.any(String),
            skills: expect.any(Array),
            task: expect.any(String),
            updated_at: expect.any(String)
        }));
        done();
    });
});

describe("POST /api/v1/tasks/:taskId/mark-completed ", () => {
    test("It should mark a task as completed", async (done) => {

        var taskFromDB = await Task.findOne({ state: Task.States.Assigned });
        
        expect(taskFromDB).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));
        const response = await request(app).post("/api/v1/tasks/" + taskFromDB.id + "/mark-completed");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            task: expect.any(Object)
        }));
        expect(response.body.task).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            priority: expect.any(Number),
            required_skills: expect.any(Array),
            state: Task.States.Completed
        }));
        done();
    });
});

describe("GET /api/v1/agents ", () => {
    test("It should return a list of agents with tasks assigned (if any)", async (done) => {

        const response = await request(app).get("/api/v1/agents");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            agents: expect.any(Array)
        }));
        expect(response.body.agents.length).toBeGreaterThan(0);
        expect(response.body.agents[0]).toEqual(expect.objectContaining({
            _id: expect.any(String),
            created_at: expect.any(String),
            id: expect.any(String),
            skills: expect.any(Array),
            updated_at: expect.any(String)
        }));
        done();
    })
});

