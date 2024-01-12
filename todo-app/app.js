// const express = require("express");
// const app = express();
// const { Todo } = require("./models");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cookieParser = require('cookie-parser');
// const csrf = require("tiny-csrf");

// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("secured string cannot be accessed"));
// app.use(csrf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));
const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"])); //THE TEXT SHOULD BE OF 32 CHARACTERS ONLY



app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();

    const overdueTodos = allTodos.filter(todo => todo.isOverdue());
    const dueTodayTodos = allTodos.filter(todo => todo.isDueToday());
    const dueLaterTodos = allTodos.filter(todo => todo.isDueLater());
    const completed = allTodos.filter(todo => todo.isCompleted());

    if (request.accepts("html")) {
      response.render('index.ejs', {
        allTodos,
        overdueTodos,
        dueTodayTodos,
        dueLaterTodos,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
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

app.set("view engine ", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
  try {
    const todos = await Todo.findAll();
    return response.json(todos)
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const status = todo.completed;
    //logic to toogle checkbox if true than do false and vise-versa
    const updatedTodo = await todo.setCompletionStatus(status);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


// app.put("/todos/:id/markAsCompleted", async function (request, response) {
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     const updatedTodo = await todo.markAsCompleted();
//     return response.json(updatedTodo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });


app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  try {
    const deletedItem = await Todo.deleteTodo(request.params.id);
    response.send(deletedItem ? true : false);
  } catch (error) {
    console.error(error);
    return response.status(442).json(error);
  }
  // try {
  //   await Todo.remove(request.params.id);
  //   return response.json({ success: true });
  // } catch (error) {
  //   return response.status(422).json(error);
  // }
});

module.exports = app;