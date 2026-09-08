import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/manager/overview")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load overview"));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manager Overview</h1>
            <p className="text-sm text-gray-500">Signed in as {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {!data ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{data.totalUsers}</p>
                <p className="text-xs text-gray-500">Team Members</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">{data.totalTasks}</p>
                <p className="text-xs text-gray-500">Total Tasks</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{data.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{data.pending + data.inProgress}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Team Breakdown</h2>
              </div>
              {data.breakdown.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No team members yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.breakdown.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 flex-wrap gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">{u.doneCount}</span> / {u.taskCount} tasks done
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
