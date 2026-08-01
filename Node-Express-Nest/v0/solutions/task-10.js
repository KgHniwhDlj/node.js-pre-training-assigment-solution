// Express.js GET /todos/search endpoint with query params
// TODO: implement

const express = require('express');
const app = express();

app.use(express.json());

const todos=[
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build Todo App', completed: true },
    { id: 3, title: 'Write Tests', completed: false }
]

app.get('/todos/search', (req, res) => {
    const { completed } = req.query;

    if (completed === undefined) {
        return res.json(todos);
    }

    const isCompleted = completed === 'true'
    const filteredTodos = todos
        .filter(t => t.completed === isCompleted);

    res.json(filteredTodos);
})

module.exports = app;