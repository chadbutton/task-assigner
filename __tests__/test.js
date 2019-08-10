const request = require('supertest');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');

const app = require('../app');

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

describe("GET /tasks ", () => {
    test("It should get tasks", async (done) => {
        const response = await request(app).get("/tasks")
        expect(response.body).toEqual([]);
        expect(response.statusCode).toBe(200);
        done();
    });
});