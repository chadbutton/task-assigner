const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../../app');
const factory = require('../../data/factory');

// setup teardown -----------

beforeAll(async () => {
    await factory.regenerateAllFakeDBData();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error  
    await mongoose.disconnect();
});

//Error handing tests -----------

describe("GET / ", () => {
    test("It should get a 404 not found", async (done) => {
        const response = await request(app).get("/")
        expect(response.statusCode).toBe(404);
        done();
    });
});

//TODO
describe("POST /tasks/assign-to-agent", () => {
    test.skip("It should get an error that no agent could be selected (rule 5)", async (done) => {
        const response = await request(app).post("/tasks/assign-to-agent");
        expect(response.statusCode).toBe(404);
        done();
    });
});

describe("POST /tasks/:taskId/mark-completed", () => {
    test("It should get a 404 not found (invalid id)", async (done) => {
        const response = await request(app).post("/tasks/999/mark-completed");
        expect(response.statusCode).toBe(404);
        done();
    });
});

//Expected behavior tests -----------

describe("POST /tasks/assign-to-agent", () => {
    test("It should create a new task and assign to agent ", async (done) => {
        const response = await request(app).post("/tasks/assign-to-agent")
        expect(response.body).toEqual(expect.objectContaining({
            agent: expect.any(Object)
        }));
        expect(response.body).toEqual(expect.objectContaining({
            task: expect.any(Object)
        }));
        expect(response.body.task).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            priority: expect.any(Number),
            required_skills: expect.any(Array),
            state: "assigned",
            agent: expect.any(String)
        }));
        expect(response.body.agent).toEqual(expect.objectContaining({
            __v: expect.any(Number),
            _id: expect.any(String),
            created_at: expect.any(String),
            id: expect.any(String),
            skills: expect.any(Array),
            task: expect.any(String),
            updated_at: expect.any(String)
        }));
        expect(response.statusCode).toBe(200);
        done();
    });
});

describe("POST /tasks/:taskId/mark-completed ", () => {
    test.skip("It should mark a task as completed", async (done) => {
        const response = await request(app).post("/tasks/:taskId/mark-completed", { params: { taskId: 1 } })
        expect(response.body).toEqual({});
        expect(response.statusCode).toBe(200);
        done();
    });
});

