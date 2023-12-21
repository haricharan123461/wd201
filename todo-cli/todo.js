const todoList = () => {
    let all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
        all[index].completed = true
    }

    const overdue = () => {
        // Write the date check condition here and return the array
        // of overdue items accordingly.
        return all.filter((todo) => todo.dueDate < today);
    }

    const dueToday = () => {
        // Write the date check condition here and return the array
        // of todo items that are due today accordingly.
        return all.filter((todo) => todo.dueDate === today);
    }

    const dueLater = () => {
        // Write the date check condition here and return the array
        // of todo items that are due later accordingly.
        return all.filter((todo) => todo.dueDate > today);
    }

    const toDisplayableList = (vlist) => {
        // Format the To-Do list here, and return the output string
        // as per the format given above.
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
        return d.toISOString().split("T")[1]
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
