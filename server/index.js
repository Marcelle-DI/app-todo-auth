const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const morgan = require('morgan');
const uuid = require('node-uuid');
const path = require('path');
const rfs = require('rotating-file-stream'); // version 2.x
//const validator = require('express-validator');
const { checkSchema, validationResult } = require('express-validator');
// setup morgan for logging
// create an id token
const mt = morgan.token('id', getId = (req) => {
  return req.id;
});
 
const assignId = (req, res, next) => {
  req.id = uuid.v4();
  next();
}

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(assignId); // assign uuid to each request 
app.use(morgan(':id :method :url :status :res[content-length] :response-time', { stream: accessLogStream })); //setup the logger

//ROUTES//

//create a todo
// app.post("/api/todos", 
//         body('description').not().isLength({min:5}).withMessage('Description must have more than 5 characters'), 
//         async (req, res) => {

//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             //return res.status(400).json({ errors: errors.array() });
//             throw new Error(errors);
//           }

        
//         const { description } = req.body;
//         console.log(req.body);

//         const newTodo = await pool.query(
//             "INSERT INTO todo (description) VALUES($1) RETURNING *",
//             [description]
//         );
//         res.status(200).json(newTodo.rows[0]);
//     }
//     catch (error) {
//         console.error(error);
//         //return res.status(422).json({"status": error.status, "data": error.data, "message": error.message});
//         return res.status(422).jsonp(errors.array());
//     }
// });

// app.post("/api/todos", 
//                 body('description').not().isEmpty(),
//                 body('description').isLength({min:5}), 
//                 async (req, res) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() });
//     }

//     try {
//         const { description } = req.body;
//         console.log(req.body);

//         const newTodo = await pool.query(
//             "INSERT INTO todo (description) VALUES($1) RETURNING *",
//             [description]
//         );
//         res.status(200).json(newTodo.rows[0]);
//     }
//     catch (error) {
//         console.error(error);
//         return res.status(422).json({"status": error.status, "data": error.data, "message": error.message});
//         //return res.status(422).jsonp(errors.array());
//     }
// });

app.post("/api/todos", checkSchema({
    description: {
        isLength: {
          errorMessage: 'Description should be at least 3 chars long and not longer than 25...',
          options: [{ min: 3, max: 25 }],
        },
      }
    }), 
        async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({"success":"false"},{ errors: errors.array() });
    }

    try {
        const { description } = req.body;
        console.log(req.body);

        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        //res.status(200).json(newTodo.rows[0]);
        res.json({"success":"true"});
    }
    catch (error) {
        console.error(error);
        return res.status(422).json({"status": error.status, "data": error.data, "message": error.message});
        //return res.status(422).jsonp(errors.array());
    }
});

//get all todos
app.get("/api/todos", async (req, res) => {

    try {
    const allTodos = await pool.query("SELECT * FROM todo");
    return res.json(allTodos.rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({"status": error.status, "data": error.data, "message": error.message});
    }

});

// Set default API response
app.get('/api/todo', function (req, res) {
    res.json({
        status: 'todo API is working',
        message: 'Welcome to the todo api'
    });
});

//get a todo by id
app.get("/api/todos/:id", async (req, res) => {
    try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
    res.json(todo.rows[0]);      

    }
    catch (error) {
        console.error(error);
        res.status(400).json({"status": error.status, "data": error.data, "message": error.message});
    }



});

//update a todo

app.put("/api/todos/:id", async (req, res) => {

    try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
    );
    res.json("Todo was updated!");
    }
    catch (error) {
        console.error(error);
        res.status(400).json({"status": error.status, "data": error.data, "message": error.message});
    }


});

//delete a todo

app.delete("/api/todos/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
            id
        ]);
        res.json("Todo was deleted!");
    }
    catch (error) {
        console.error(error);
        res.status(400).json({"status": error.status, "data": error.data, "message": error.message});
    }

});

// unexpected routes
app.use('/api/*', (req, res) => {
    return res.status(400).json({ message: 'Bad Request' })
  })

app.listen(5000, () => {
    console.log("server has started on port 5000");
});
