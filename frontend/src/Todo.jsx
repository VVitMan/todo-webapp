import axios from "axios";
import { useEffect, useState } from "react";
export default function Todo() {
  const baseURL = "https://68baddc184055bce63f06922.mockapi.io/api/v1";

  // Task
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Status
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit task
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    console.log("Component mounted!");
    handleGetTasks(); // get data at first time
  }, []);

  // Get tasks handler
  const handleGetTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}/tasks`);
      console.log("Get data:", response.data);
      if (response.status == 200) {
        setTasks(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message); // Capture the error message
      setLoading(false);
    }
  };

  // Create new task
  const dataTask = {
    task: newTask,
    status: false,
  };
  const handleCreate = async () => {
    try {
      const response = await axios.post(`${baseURL}/tasks`, dataTask);
      if (response.status == 201) {
        console.log("Create Task:", response.data);
        setTasks([...tasks, response.data]); // Update UI with re-rendering data
        setNewTask(""); // Clear input field
      }
    } catch (error) {
      setError(error.message); // Capture the error message
      setLoading(false);
    }
  };

  // Update: Set Edit task value, Update
  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.task);
  };
  const handleUpdate = async (id) => {
    // Object update task
    const updateTask = {
      task: editText,
    };

    try {
      const response = await axios.put(`${baseURL}/tasks/${id}`, updateTask);
      if (response.status == 200) {
        console.log("Update data:", response.data);

        // Replace old data with new data if match the id, and left the other as the same
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
        setEditId(null); // exit edit mode
        setEditText("");
      }
    } catch (error) {
      setError(error.message);
      console.log("Update error:", error.message);
    }
  };

  // Delete task handler
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/tasks/${id}`);
      if (response.status == 200) {
        console.log("Delete data:", response.data);
        setTasks(tasks.filter((task) => task.id !== id)); // Update state to remove deleted task
      }
    } catch (error) {
      setError(error.message); // Capture the error message
    }
  };

  // Display status
  if (error) return <div>Error: {error}</div>;
  if (loading)
    return <span className="loading loading-spinner loading-lg"></span>;

  return (
    <div className="bg-base-100 max-w-full shadow-md p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>

      {/* Create a Task */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1 bg-gray-200 text-base-100"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          type="text"
          placeholder="Put your task"
        />
        <button className="btn btn-primary" onClick={() => handleCreate()}>
          Create
        </button>
      </div>

      {/* Tasks List */}
      <ul className="list rounded-2xl shadow-md space-y-3">
        {tasks.map((task) => (
          <li
            className="list-row flex justify-between items-center p-3 rounded-lg border border-gray-600 text-shadow-white"
            key={task.id}
          >
            {editId === task.id ? (
              <div className="flex w-full gap-2">
                {/* Edit Mode */}
                <input
                  className="input bg-white text-base-100"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdate(task.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                {/* Check box & Task name */}
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="text-shadow-white items-center">{task.task}</span>

                <div className="flex gap-2">
                  {/* Edit Task */}
                  <button
                    className="btn btn-outline btn-sm btn-accent"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>
                  {/* Delete Task */}
                  <button
                    className="btn btn-outline btn-sm btn-secondary"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
