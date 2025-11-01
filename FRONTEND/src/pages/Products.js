import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import Spinner from "../components/Spinner";

export default function Products() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", categoryId: "", price: "" });
  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    categoryId: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      console.log("products", data)
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load products");
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, []);

  const create = async () => {
    if (!form.name || !form.categoryId || !form.price) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          categoryId: form.categoryId,
          price: parseFloat(form.price),
        }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      toast.success("Product added successfully");
      setForm({ name: "", categoryId: "", price: "" });
      setOpen(false);
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products/" + id, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product deleted");
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product) => {
    setEditForm({
      _id: product._id,
      name: product.name,
      categoryId: product.categoryId?._id || product.categoryId || "",
      price: product.price,
    });
    setEditOpen(true);
  };

  const updateProduct = async () => {
    if (!editForm.name || !editForm.categoryId || !editForm.price) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${editForm._id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            categoryId: editForm.categoryId,
            price: parseFloat(editForm.price),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update product");
      toast.success("Product updated successfully");
      setEditOpen(false);
      await fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Products
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" /> Add Product
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
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Price</th>
                  <th className="py-3 px-4 text-center">Edit</th>
                  <th className="py-3 px-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {list.length > 0 ? (
                  list.map((p, index) => (
                    <tr
                      key={p._id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                        {p.name}
                      </td>
                      <td className="py-3 px-4">
                        {p.categoryId?.name || "Uncategorized"}
                      </td>
                      <td className="py-3 px-4">
                        {p?.status || "Uncategorized"}
                      </td>
                      <td className="py-3 px-4 text-center">₹{p.price}</td>

                      <td className="py-3 px-4 text-center">
                        <button
                          title="Edit"
                          onClick={() => openEdit(p)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          title="Delete"
                          onClick={() => remove(p._id)}
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
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Product">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
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

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Product">
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Product Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={editForm.categoryId}
            onChange={(e) =>
              setEditForm({ ...editForm, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Price"
            type="number"
            value={editForm.price}
            onChange={(e) =>
              setEditForm({ ...editForm, price: e.target.value })
            }
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
              onClick={updateProduct}
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
