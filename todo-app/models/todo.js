"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        static addTodo({ title, dueDate }) {
            return this.create({ title: title, dueDate: dueDate, completed: false });
        }
        static deleteTodo(id) {
            return this.destroy({ where: { id: id } });

        }
        markAsCompleted() {
            return this.update({ completed: true });
        }
        setCompletionStatus(val) {
            return this.update({ completed: val });
        }
        static getTodos() {
            return this.findAll();

        }

        static async remove(id) {
            return this.destroy({
                where: {
                    id,
                },

            })
        }

        isOverdue() {
            const currentDate = new Date();
            if (!this.dueDate) {
                return false;
            }
            const dueDate1 = new Date(this.dueDate);
            return dueDate1 < currentDate //&& !this.completed;
        }

        isDueToday() {
            const currentDate = new Date();

            // Check if dueDate is defined
            if (!this.dueDate) {
                return false;
            }

            const dueDate1 = new Date(this.dueDate);
            return (
                dueDate1.getDate() === currentDate.getDate() &&
                dueDate1.getMonth() === currentDate.getMonth() &&
                dueDate1.getFullYear() === currentDate.getFullYear()
                //&& !this.completed
            );
        }

        isDueLater() {
            const currentDate = new Date();
            if (!this.dueDate) {
                return false;
            }
            const dueDate1 = new Date(this.dueDate);
            return dueDate1 > currentDate // && !this.completed;
        }

        isCompleted(val) {
            const notval = !val;
            return this.update({ completed: notval })
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
