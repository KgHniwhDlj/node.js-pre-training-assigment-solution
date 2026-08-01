// Express.js static files serving for ToDo frontend
// TODO: implement

const express = require('express');
const app = express();

app.use('/static', express.static('public'));

module.exports = {}; 