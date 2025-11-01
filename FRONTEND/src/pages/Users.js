import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Trash2, Plus, Pencil } from "lucide-react";
import Spinner from "../components/Spinner";

export default function Users() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const create = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create user");
      toast.success("User added successfully");
      setForm({ name: "", email: "", mobile: "" });
      setOpen(false);
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/" + id, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user) => {
    setEditForm({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
    });
    setEditOpen(true);
  };

  const updateUser = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${editForm._id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            email: editForm.email,
            mobile: editForm.mobile,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      toast.success("User updated successfully");
      setEditOpen(false);
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Users
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <Card>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">S.No</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Mobile</th>
                  <th className="py-3 px-4 text-center">Edit</th>
                  <th className="py-3 px-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {list.length > 0 ? (
                  list.map((u, index) => (
                    <tr
                      key={u._id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                        {u.name}
                      </td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{u.mobile || "-"}</td>

                      <td className="py-3 px-4 text-center">
                        <button
                          title="Edit"
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          title="Delete"
                          onClick={() => remove(u._id)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add User">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={create}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit User">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Mobile"
            value={editForm.mobile}
            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={updateUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
