const request = require('supertest');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');

const app = require('../app');
const factory = require('../api/data/factory');

beforeAll(async () => {
    await factory.regenerateAllFakeDBData();
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error  
    await mongoose.disconnect();
});

describe("GET / ", () => {
    test("It should get a 404 not found", async (done) => {
        const response = await request(app).get("/")
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

describe("POST /tasks/assign-to-agent", () => {
    test("It should get a 404 not found (invalid id)", async (done) => {
        const response = await request(app).post("/tasks/assign-to-agent")
        expect(response.body).toEqual({});
        expect(response.statusCode).toBe(200);
        describe("POST /tasks/:taskId/mark-completed ", () => {
            test("It should mark a task as completed", async (done) => {
                const response = await request(app).post("/tasks/:taskId/mark-completed", { params: { taskId: 1 }})
                expect(response.body).toEqual({});
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});

