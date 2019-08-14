# Work Distribution Service

## Description
This is a work distribution service that can distribute tasks to agents.

It was implemented using Node with Express, MongoDB (mongoose) and Jest/Supertest for the unit tests.

### Docker files have been provided which will launch a web service and mongodb service directly into a docker container.
1. `run docker-compose`
2. open `http://DOCKER_VM_IP:3000` in a browser.

### Or you can clone the git repo and run the following commands:
1. `npm run test ` to run all unit tests which uses a test db
2. `npm run dev` to run in development and uses a dev db
3. `npm run prod` to run in production and uses a prod db

### Endpoints:
1. `http://HOSTNAME:3000/` which simply indicates whether the service is up and running.
2. `http://HOSTNAME:3000/api/v1/tasks/assign-to-agent` which will create a new task and assign it according a set of rules.
3. `http://HOSTNAME:3000/api/v1/tasks/:taskId/mark-completed` which will mark a given task as complete.
3. `http://HOSTNAME:3000/api/v1/agents` which will return a list of all agents and their assigned tasks (if any).
