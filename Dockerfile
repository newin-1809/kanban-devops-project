FROM node:18-alpine

WORKDIR /usr/src/app

COPY app/package*.json ./
# Initializing a blank package.json and installing express locally for the build
RUN npm init -y && npm install express

COPY app/ ./

EXPOSE 5000

CMD ["node", "server.js"]