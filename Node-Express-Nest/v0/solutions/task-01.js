// Express.js app with GET /todos endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and GET /todos logic

const todos=[
        { id: 1, title: 'Learn React', completed: false },
        { id: 2, title: 'Build Todo App', completed: true },
        { id: 3, title: 'Write Tests', completed: false }
]

app.get('/todos', (req, res) => {
    res.json(todos);
})


module.exports = app; 