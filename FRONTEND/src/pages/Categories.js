import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function Categories() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editForm, setEditForm] = useState({ _id: "", name: "", description: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Failed to load categories.");
      toast.error("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const create = async () => {
    if (!form.name.trim()) return toast.error("Please enter a category name");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      toast.success("Category added successfully");
      setForm({ name: "", description: "" });
      setOpen(false);
      await fetchList();
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      toast.success("Category deleted");
      await fetchList();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (category) => {
    setEditForm({
      _id: category._id,
      name: category.name,
      description: category.description || "",
    });
    setEditOpen(true);
  };

  const updateCategory = async () => {
    if (!editForm.name.trim()) return toast.error("Please enter a category name");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/categories/${editForm._id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
          }),
        }
      );
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      toast.success("Category updated successfully");
      setEditOpen(false);
      await fetchList();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Categories
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow-sm disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Category Name</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Edit</th>
                <th className="py-3 px-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : list.length > 0 ? (
                list.map((c, idx) => (
                  <tr
                    key={c._id}
                    className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-400 max-w-xs truncate">
                      {c.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        title="Edit"
                        onClick={() => openEdit(c)}
                        disabled={loading}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition disabled:opacity-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        title="Delete"
                        onClick={() => remove(c._id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Category">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Description (optional)"
            rows="3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            disabled={loading}
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
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Category">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Category name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            disabled={loading}
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Description (optional)"
            rows="3"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            disabled={loading}
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
              onClick={updateCategory}
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
