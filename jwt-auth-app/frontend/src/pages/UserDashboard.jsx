import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/tasks", { title });
      setTitle("");
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    }
  };

  const toggleStatus = async (task) => {
    const next =
      task.status === "pending" ? "in-progress" : task.status === "in-progress" ? "completed" : "pending";
    await api.patch(`/tasks/${task._id}`, { status: next });
    loadTasks();
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;

  const statusColor = {
    pending: "bg-gray-100 text-gray-600",
    "in-progress": "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500 capitalize">{user?.role} dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
            <p className="text-xs text-gray-500">Total Tasks</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{inProgressCount}</p>
            <p className="text-xs text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">{pendingCount}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Add task */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </form>

        {/* Task list */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {loading ? (
            <p className="p-4 text-sm text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No tasks yet. Add one above.</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-4 gap-3 flex-wrap">
                <span className="text-sm text-gray-800">{task.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(task)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[task.status]}`}
                  >
                    {task.status}
                  </button>
                  <button
                    onClick={() => removeTask(task._id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
