const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {// Function to extract CSRF token from response
  let $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {// Test suite for the Todo Application
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {  // After all tests, close the server and sequelize connection
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {  // Test to Create a todo and expect a JSON response at /todos POST endpoint
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  // Test: Update a todo's completion status
  test('Updating a to-do', async () => {
    // First, create a to-do item
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    const createResponse = await agent.post('/todos').send({
      title: 'Buy groceries',
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: csrfToken,
    });

    // Get the latest todo and mark it as complete
    const status = false;
    const groupedTodosResponse = await agent.get("/").set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayTodos.length;
    const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent.put(`/todos/${latestTodo.id}/`).send({
      _csrf: csrfToken,
      completed: true,
    });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(!status);
  });

  // Test to Delete a todo item
  test("Delete a todo item", async () => {
    // Create a new todo
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    const createTodoResponse = await agent.post("/todos").send({
      _csrf: csrfToken,
      title: "Todo to Delete",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });

    // Get the latest todo and delete it
    const groupedTodosResponse = await agent.get("/").set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayTodos.length;
    const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const deleteResponse = await agent.delete(`/todos/${latestTodo.id}/`).send({
      _csrf: csrfToken,
    });
    expect(deleteResponse.statusCode).toBe(200);
  });
});
