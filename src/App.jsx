import { useState } from "react";
import "./App.css";
import "bootswatch/dist/lumen/bootstrap.min.css";

const AddTask = ({ handleAddTask }) => {
  return (
    <div className="add-task">
      <label htmlFor="addTask">Add task:</label>
      <br />
      <form onSubmit={handleAddTask}>
        <input id="addTask" type="text" class="form-control" />
        <input type="submit" value="Add" className="btn btn-secondary" />
      </form>
    </div>
  );
};

const TaskList = ({ tasks, handleTaskComplete, handleDelete }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          taskid={task.id}
          taskcompletionstatus={`${task.completed}`}
        >
          <input
            className="form-check-input"
            type="checkbox"
            onChange={handleTaskComplete}
          />
          <p>{task.name}</p>
          <button className="btn btn-secondary" onClick={handleDelete}>
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (e) => {
    e.preventDefault();

    const name = e.currentTarget.addTask.value;
    if (name.length === 0) return;
    setTasks((prev) => {
      return [...prev, { id: uuidv4(), name, completed: false }];
    });

    e.currentTarget.addTask.value = "";
  };

  const handleTaskComplete = (e) => {
    const id = e.target.parentElement.getAttribute("taskid");
    let task = tasks.filter((task) => task.id === id);
    task = task[0];
    const taskIndex = tasks.findIndex((task) => task.id === id);

    const isChecked = e.target.checked;

    if (isChecked === true) {
      e.target.parentElement.classList.remove("fade-in-anim-300s");
      e.target.parentElement.classList.add("fade-out-anim-300s");
      setTimeout(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        setTasks((prev) => {
          return [
            ...prev,
            {
              id: task.id,
              name: task.name,
              completed: isChecked,
            },
          ];
        });
        e.target.parentElement.classList.remove("fade-out-anim-300s");
        e.target.parentElement.classList.add("fade-in-anim-300s");
      }, 300);
    }

    e.target.parentElement.setAttribute("taskcompletionstatus", isChecked);
  };

  const handleDelete = (e) => {
    const id = e.target.parentElement.getAttribute("taskid");
    e.target.parentElement.classList.add("fade-out-anim-300s");
    setTimeout(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    }, 300);
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <AddTask handleAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        handleTaskComplete={handleTaskComplete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
