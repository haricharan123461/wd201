const express = require("express");
const app = express();
const { Todo } = require("./models"); // Assuming a Todo model is defined 
const path = require("path");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

// Middleware setup
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(cookieParser("Shh! some secret string")); // Parse cookies with a secret string
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"])); // CSRF protection

// Define route for the root URL
app.get("/", async (request, response) => {
  try {
    // Retrieve all todos
    const allTodos = await Todo.getTodos();

    // Filter todos based on different criteria
    const overdueTodos = allTodos.filter(todo => todo.isOverdue());
    const dueTodayTodos = allTodos.filter(todo => todo.isDueToday());
    const dueLaterTodos = allTodos.filter(todo => todo.isDueLater());
    const completed = allTodos.filter(todo => todo.isCompleted());

    // Check the request format (HTML or JSON) and respond accordingly
    if (request.accepts("html")) {
      // Render HTML using the "index.ejs" template
      response.render('index.ejs', {
        allTodos,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completed,
        csrfToken: request.csrfToken(), // Pass CSRF token to the view
      });
    } else {
      // Respond with JSON data
      response.json({
        allTodos,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos
      });
    }
  } catch (error) {
    console.error(error);
    response.status(404).json({ error: "rendering Error" });
  }
});

// Set the view engine to "ejs" and serve static files from the 'public' directory
app.set("view engine ", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Define route to get a list of all todos
app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");

  try {
    // Retrieve all todos
    const todos = await Todo.findAll();
    return response.json(todos)
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// Define route to get a specific todo by ID
app.get("/todos/:id", async function (request, response) {
  try {
    // Retrieve a todo by ID
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// Define route to add a new todo
app.post("/todos", async function (request, response) {
  try {
    // Add a new todo
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate
    });
    return response.redirect("/"); // Redirect to the root after adding a todo
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// Define route to update a todo by ID
app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const status = todo.completed;
    // Logic to toggle checkbox status (if true, set to false and vice versa)
    const updatedTodo = await todo.setCompletionStatus(status);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// Define route to delete a todo by ID
app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    // Delete a todo by ID
    const deletedItem = await Todo.deleteTodo(request.params.id);
    response.send(deletedItem ? true : false);
  } catch (error) {
    console.error(error);
    return response.status(442).json(error);
  }
});

// Export the express app
module.exports = app;
