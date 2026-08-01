// Express.js app with POST /todos endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and POST /todos logic
app.use(express.json());

const todos=[
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build Todo App', completed: true },
    { id: 3, title: 'Write Tests', completed: false }
]

app.post('/todos', (req, res) => {
    const { title } = req.body;

    const newTodo = {
        id: Date.now(),
        title: title,
        completed: false
    }

    todos.push(newTodo);
    res.status(200).json(newTodo);
})

module.exports = app; 