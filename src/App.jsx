import { useState } from "react";
import "./App.css";
import "bootswatch/dist/lumen/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

const chimeSFX = new Audio("/src/assets/sounds/chime-sound.mp3");
chimeSFX.volume = 0.5;

const AddTask = ({ handleAddTask }) => {
  return (
    <div className="add-task">
      <label htmlFor="addTask">Add task:</label>
      <br />
      <form onSubmit={handleAddTask}>
        <input id="addTask" type="text" className="form-control" />
        <input type="submit" value="Add" className="btn btn-secondary" />
      </form>
    </div>
  );
};

const TaskList = ({ tasks, handleTaskStatus, handleDelete }) => {
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
            onChange={handleTaskStatus}
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

export default function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (e) => {
    e.preventDefault();

    const name = e.currentTarget.addTask.value;
    if (name.replace(/ /g, "").length === 0) {
      e.currentTarget.addTask.value = "";
      return;
    }

    setTasks((prev) => {
      return [...prev, { id: uuidv4(), name, completed: false }].sort((a, b) =>
        a.completed.toString().localeCompare(b.completed.toString())
      );
    });
    e.currentTarget.addTask.value = "";
  };

  const handleTaskStatus = (e) => {
    const id = e.target.parentElement.getAttribute("taskid");
    const task = tasks.filter((task) => task.id === id)[0];
    const taskEl = e.target.parentElement;
    const taskIndex = tasks.findIndex((task) => task.id === id);

    const isChecked = e.target.checked;

    setTimeout(() => {
      setTasks(tasks.filter((task) => task.id !== id));
      setTasks((prev) => {
        return [
          ...prev,
          {
            id: task.id,
            name: task.name,
            completed: !task.completed,
          },
        ].sort((a, b) =>
          a.completed.toString().localeCompare(b.completed.toString())
        );
      });
    }, 300);

    if (
      taskIndex < tasks.length - 1 &&
      tasks[taskIndex + 1].completed === false
    ) {
      taskEl.classList.remove("fade-in-anim-300s");
      taskEl.classList.add("fade-out-anim-300s");

      setTimeout(() => {
        taskEl.classList.remove("fade-out-anim-300s");
        taskEl.classList.add("fade-in-anim-300s");
      }, 300);
    }

    // Task completion sound FX
    if (isChecked === true) {
      // chimeSFX.load();
      chimeSFX.play();
    }

    taskEl.setAttribute("taskcompletionstatus", e.target.checked);
  };

  const handleDelete = (e) => {
    const id = e.target.parentElement.getAttribute("taskid");
    e.target.parentElement.classList.remove("fade-in-anim-300s");
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
        handleTaskStatus={handleTaskStatus}
        handleDelete={handleDelete}
      />
    </div>
  );
}
