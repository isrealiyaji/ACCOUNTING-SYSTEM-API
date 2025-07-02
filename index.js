const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "inprogress",
  COMPLETED: "completed",
};

class Task {
  constructor(title, description = "") {
    if (!title) {
      throw new Error("Title is required");
    }
    this.title = title;
    this.description = description;
    this.status = TaskStatus.PENDING;
  }

  setTaskStatus(newStatus) {
    const checkStatus = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ];

    if (checkStatus.includes(newStatus)) {
      this.status = newStatus;
    } else {
      console.log(
        `The status is invalid: "${newStatus}". Use either pending, in progress or completed.`
      );
    }
  }

  getStatus() {
    return this.status;
  }
}

class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(title, description = "") {
    if (!title) {
      console.log("Error: Title is required.");
      return;
    }
    const newTask = new Task(title, description);
    this.tasks.push(newTask);
    console.log(`Task added:"${title}" [Status: pending]`);
  }

  setTaskStatus(index, newStatus) {
    if (index >= 0 && index < this.tasks.length) {
      const task = this.tasks[index];
      task.setTaskStatus(newStatus);
      console.log(`Task "${task.title}" updated to [${task.getStatus()}]`);
    } else {
      console.log("Task is not valid.");
    }
  }

  showTasks() {
    if (this.tasks == 0) {
      console.log("Task not available.");
      return;
    }

    console.log("To-Do List:");
    this.tasks.forEach((task, index) => {
      console.log(
        `${index + 1}. ${task.title} - ${
          task.description
        } [${task.getStatus()}]`
      );
    });
  }
}

const todo = new TodoList();

todo.addTask("Buy bla bla bla", "Description");
todo.addTask("Learn nodejs", "Learn Nodejs with");

todo.showTasks();

todo.setTaskStatus(0, TaskStatus.IN_PROGRESS);
todo.setTaskStatus(1, TaskStatus.COMPLETED);

todo.showTasks;
