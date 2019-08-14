# Work Distribution Service

## Description
This is a work distribution service that assigns tasks to agents based on a set of rules.

It was implemented using Node with Express, MongoDB (mongoose) and Jest/Supertest for the unit tests.

### Docker files have been provided which will launch a web service and mongodb service directly into a docker container.
1. run `docker-machine start` to start vm if not already running.
2. run `docker-machine env` to get a list of environment variables 
3. run `eval $(docker-machine env)` to configure shell 
4. run `docker-compose up`
5. open `http://DOCKER_VM_IP:3000` in a browser to verify.

### Or you can clone the git repo and run the following commands:
1. `npm run test ` to run all unit tests which uses a test db
2. `npm run dev` to run in development and uses a dev db
3. `npm run prod` to run in production and uses a prod db

### Endpoints:
1. `http://HOSTNAME:3000/` which simply indicates whether the service is up and running.
2. `http://HOSTNAME:3000/api/v1/tasks/assign-to-agent` which will create a new task and assign it according a set of rules.
3. `http://HOSTNAME:3000/api/v1/tasks/:taskId/mark-completed` which will mark a given task as complete.
3. `http://HOSTNAME:3000/api/v1/agents` which will return a list of all agents and their assigned tasks (if any).

### Also included a postman file which demonstrates how to call the API:
task-assigner-api.postman_collection.json