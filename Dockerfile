FROM node:12.8.0
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install nodemon -g
RUN npm install jest -g
COPY . .