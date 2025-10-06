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
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Create a Task */}
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        type="text"
        placeholder="Put your task"
      />
      <button onClick={() => handleCreate()}>Create</button>

      {/* Tasks List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editId === task.id ? (
              <>
                {/* Edit Mode */}
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleUpdate(task.id)}>Save</button>
              </>
            ) : (
              <>
                {task.task}
                {/* Edit Task */}
                <button onClick={() => startEdit(task)}>Edit</button>
                {/* Delete Task */}
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
