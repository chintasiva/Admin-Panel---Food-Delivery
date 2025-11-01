import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import Spinner from "../components/Spinner";
import { ChevronDown, ChevronUp, Package, IndianRupee } from "lucide-react";
export default function Orders() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      console.log("ordes", data)
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError("Unable to load orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndProducts = async () => {
    try {
      const [uRes, pRes] = await Promise.all([
        fetch("http://localhost:5000/api/users"),
        fetch("http://localhost:5000/api/products"),
      ]);
      const [uData, pData] = await Promise.all([uRes.json(), pRes.json()]);
      setUsers(Array.isArray(uData) ? uData : []);
      setProducts(Array.isArray(pData) ? pData : []);
    } catch (err) {
      console.error("Users/Products fetch error:", err);
      toast.error("Failed to load users or products");
    }
  };

  useEffect(() => {
    fetchUsersAndProducts();
    fetchOrders();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productId === product._id);
      if (found)
        return prev.map((p) =>
          p.productId === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const changeQty = (productId, delta) => {
    setCart((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((p) => p.productId !== productId));

  const createOrder = async () => {
    if (!selectedUser) return toast.error("Select a user");
    if (cart.length === 0) return toast.error("Cart is empty");
    setLoading(true);
    try {
      const payload = {
        userId: selectedUser,
        items: cart.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
          price: c.price,
        })),
      };
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create order");
      toast.success("Order created successfully");
      setOpen(false);
      setCart([]);
      await fetchOrders();
    } catch (err) {
      console.error("Create order error:", err);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;


  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Orders
        </h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4" /> Create Order
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Total Orders">
              <div className="text-2xl font-bold">{totalOrders}</div>
            </Card>
            <Card title="Total Revenue">
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
            </Card>
          </div>

          <Card title="All Orders">
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="py-3 px-4 text-left">S.No</th>
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-center">Items</th>
                    <th className="py-3 px-4 text-center">Amount</th>
                    <th className="py-3 px-4 text-center">Date</th>
                    <th className="py-3 px-4 text-center">Expand</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {orders.length > 0 ? (
                    orders.map((o, index) => {
                      const expanded = expandedOrders[o._id] || false;

                      return (
                        <React.Fragment key={o._id}>
                          <tr
                            className={`transition hover:bg-blue-50 dark:hover:bg-gray-800 ${expanded ? "bg-blue-50 dark:bg-gray-800" : ""
                              }`}
                          >
                            <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-200">
                              #{o._id.slice(-6)}
                            </td>
                            <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                              {o.userId?.name || "Unknown User"}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                              {o.items?.length || 0} item
                              {o.items?.length > 1 ? "s" : ""}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-gray-900 dark:text-gray-200">
                              ₹{o.totalAmount || 0}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                              {new Date(o.createdAt).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => toggleExpand(o._id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                              >
                                {expanded ? (
                                  <ChevronUp className="w-5 h-5 inline" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 inline" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {expanded && (
                            <tr>
                              <td colSpan="7" className="bg-gray-50 dark:bg-gray-900">
                                <div className="p-4 sm:p-5">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                      Order Details
                                    </h4>
                                  </div>

                                  {Array.isArray(o.items) && o.items.length > 0 ? (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {o.items.map((item, idx) => (
                                          <div
                                            key={item._id || idx}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                                          >
                                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                              {item.productId?.name || "Unknown Product"}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              Qty:{" "}
                                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                {item.quantity}
                                              </span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              Price: ₹{item.price}
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                     
                                      {/* <div className="flex justify-end items-center border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                        <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200 font-semibold">
                                          <IndianRupee className="w-4 h-4 text-green-600" />
                                          Total: ₹{o.totalAmount || 0}
                                        </div>
                                      </div> */}
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 italic text-sm">
                                      No items in this order
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}


      <Modal open={open} onClose={() => setOpen(false)} title="Create Order">
        <div className="space-y-3">
          <label className="text-sm">Select User</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={loading}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>

          <label className="text-sm">Products</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-auto">
            {products.map((p) => (
              <div
                key={p._id}
                className="border rounded p-2 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">₹{p.price}</div>
                </div>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={() => addToCart(p)}
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold">Cart</h4>
            <div className="space-y-2 max-h-40 overflow-auto">
              {cart.map((c) => (
                <div
                  key={c.productId}
                  className="flex justify-between items-center border rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">₹{c.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => changeQty(c.productId, -1)}
                    >
                      -
                    </button>
                    <div>{c.quantity}</div>
                    <button
                      className="px-2 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => changeQty(c.productId, 1)}
                    >
                      +
                    </button>
                    <button
                      className="text-red-600 text-sm ml-2 hover:underline"
                      onClick={() => removeFromCart(c.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-gray-500 text-sm">Cart is empty</div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <span className="font-semibold text-lg">Total:</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₹{cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={createOrder}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
