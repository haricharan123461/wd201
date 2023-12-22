//__tests__todo.js
const todoList = require("../todo");

describe("TodoList Test Suite", () => {
  let todo;

  beforeEach(() => {
    todo = todoList();
  });

  test("We Should create a new todo", () => {
    todo.add({
      title: "New Todo",
      completed: false,
      dueDate: "2023-12-31",
    });

    expect(todo.all.length).toBe(1);
    expect(todo.all[0].title).toBe("New Todo");
  });

  test("Should mark a todo as completed after its completion", () => {
    todo.add({
      title: "Incomplete Todo",
      completed: false,
      dueDate: "2023-12-31",
    });

    todo.markAsComplete(0);

    expect(todo.all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items after the time is over", () => {
    

    todo.add({
      title: "Overdue Todo",
      completed: false,
      dueDate: "2023-01-01",
    });

    const allOverDueThings = todo.overdue();

    expect(allOverDueThings.length).toBe(1);
    expect(allOverDueThings[0].title).toBe("Overdue Todo");
  });

  test("Should retrieve due today items which are mentioned", () => {
    const todayDate = new Date().toISOString().split("T")[0];

    todo.add({
      title: "Due Today Todo",
      completed: false,
      dueDate: todayDate,
    });

    const todayDueThings = todo.dueToday();

    expect(todayDueThings.length).toBe(1);
    expect(todayDueThings[0].title).toBe("Due Today Todo");
  });

  test("Should retrieve due later items", () => {
    

    todo.add({
      title: "Due Later Todo",
      completed: false,
      dueDate: "2023-12-31",
    });

    const dueLaterThings = todo.dueLater();

    expect(dueLaterThings.length).toBe(1);
    expect(dueLaterThings[0].title).toBe("Due Later Todo");
  });
});
