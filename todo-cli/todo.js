const todoList = () => {
    let all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
        all[index].completed = true
    }

    const overdue = () => {
        return all.filter((todo) => todo.dueDate < today);
    }
    const dueToday = () => {
        return all.filter((todo) => todo.dueDate === today);
    }
    const dueLater = () => {
        return all.filter((todo) => todo.dueDate > today);
    }
    const toDisplayableList = (vlist) => {
        var list = vlist.map((todo) => {
            const checkbox = todo.completed === true ? '[x]' : '[ ]';
            const formattedDate = todo.dueDate !== today ? `${todo.dueDate}` : '';
            return `${checkbox} ${todo.title} ${formattedDate}`;
        });
        function returnElementsLineByLine(list) {

            var result = list.join('\n');
            return result;
        }
        var lines = returnElementsLineByLine(list);
        return lines;
    }
    const formattedDate = d => {
        return d.toISOString().split("T")[0]
    }
    var dateToday = new Date()
    const today = formattedDate(dateToday)
    return {
        all,
        add,
        markAsComplete,
        overdue,
        dueToday,
        dueLater,
        toDisplayableList
    };
};

module.exports=todoList;
