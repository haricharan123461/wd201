"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log(
        (await Todo.overdue())
          .map((todo) => {
            return todo.displayableString();
          })
          .join("\n")
      );
      console.log("\n");

      console.log("Due Today");
      console.log(
        (await Todo.dueToday())
          .map((todo) => todo.displayableString())
          .join("\n")
      );
      console.log("\n");

      console.log("Due Later");
      console.log(
        (await Todo.dueLater())
          .map((todo) => todo.displayableString())
          .join("\n")
      );
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
        },
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") },
        },
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
        },
      });
    }

    static async markAsComplete(id) {
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let today = new Date().toLocaleDateString("en-CA");
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
