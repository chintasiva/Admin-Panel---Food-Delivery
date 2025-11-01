import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard"),
        fetch("http://localhost:5000/api/orders"),
      ]);

      if (!statsRes.ok || !ordersRes.ok)
        throw new Error("Failed to load dashboard data");

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const sortedOrders = Array.isArray(ordersData)
        ? ordersData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        : [];

      setStats(statsData);
      setRecentOrders(sortedOrders);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Failed to load dashboard data");
      toast.error("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="p-3 text-sm bg-red-100 text-red-700 rounded">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Total Users">
              <div className="text-2xl font-bold">
                {stats?.totalUsers ?? "—"}
              </div>
            </Card>
            <Card title="Products">
              <div className="text-2xl font-bold">
                {stats?.totalProducts ?? "—"}
              </div>
            </Card>
            <Card title="Orders">
              <div className="text-2xl font-bold">
                {stats?.totalOrders ?? "—"}
              </div>
            </Card>
            <Card title="Revenue">
              <div className="text-2xl font-bold">
                ₹ {stats?.totalRevenue ?? "—"}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Recent Orders">
              {recentOrders.length === 0 ? (
                <div className="text-gray-500">No recent orders</div>
              ) : (
                <ul className="space-y-3">
                  {recentOrders.map((o) => (
                    <li
                      key={o._id}
                      className="flex justify-between items-center border rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          Order {o._id?.slice(-6)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ₹{o.totalAmount ?? 0}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Recent Users">
              <RecentUsers />
            </Card>

            <Card title="Quick Actions">
              <div className="flex flex-col gap-3">
                <Link to="/products" className="w-full">
                  <button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition">
                    Add Product
                  </button>
                </Link>
                <Link to="/orders" className="w-full">
                  <button className="w-full text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition">
                    Create Order
                  </button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
      toast.error("Unable to load recent users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <div className="text-sm text-gray-500">Loading users...</div>;
  if (error)
    return (
      <div className="text-sm text-red-500 py-2 text-center">{error}</div>
    );

  return (
    <ul className="text-sm space-y-2">
      {users.slice(0, 5).map((u) => (
        <li
          key={u._id}
          className="border-b py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded"
        >
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {u.name}
          </div>
          <div className="text-xs text-gray-500">{u.email}</div>
        </li>
      ))}
      {users.length === 0 && (
        <li className="text-gray-500 text-center">No users found</li>
      )}
    </ul>
  );
}
