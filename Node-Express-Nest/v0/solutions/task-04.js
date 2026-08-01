// Express.js app with GET /todos/:id endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and GET /todos/:id logic
const todos=[
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build Todo App', completed: true },
    { id: 3, title: 'Write Tests', completed: false }
]

app.get('/todos/:id', (req, res) => {
    const id = Number(req.params.id);

    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({error: 'Not Found'});
    }

    res.json(todo);
});

module.exports = app; 