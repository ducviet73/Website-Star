"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders and total income on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTotalIncome = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders/incomes/total");
        setTotalIncome(response.data.total);
      } catch (error) {
        console.error("Error fetching total income:", error);
        setError("Failed to fetch total income");
      }
    };

    fetchOrders();
    fetchTotalIncome();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log("Updating order", orderId, "to status", newStatus); // Debugging log
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const updatedOrder = await response.json();
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(`Failed to update status: ${error.message}`);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:3000/orders/${orderId}`);
        setOrders(orders.filter((order) => order._id !== orderId));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        setError("Failed to delete order");
      }
    }
  };

  // Filter orders by status
  const handleFilterByStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/status/${status}`);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      setError("Failed to fetch orders by status");
    }
  };

  // Filter orders by date
  const handleFilterByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/date/${date}`);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders by date:", error);
      setError("Failed to fetch orders by date");
    }
  };

  // Loading Spinner
  if (isLoading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Order Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Total Income Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h2>Total Income</h2>
          <p className="h4">{totalIncome.toLocaleString()} đ</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h3>Filter Orders</h3>
          <div className="mb-3">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-primary mt-2" onClick={handleFilterByStatus}>
              Filter by Status
            </button>
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={handleFilterByDate}>
              Filter by Date
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Total Amount</th>
            <th>Shipping Address</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.totalAmount.toFixed(2)} đ</td>
              <td>
                {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}
              </td>
              <td>{order.paymentMethod}</td>
              <td>{order.status}</td>
              <td>
                <select
                  className="form-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button className="btn btn-info" onClick={() => setSelectedOrder(order)}>
                  View Details
                </button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteOrder(order._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="mt-4">
          <h2>Order Details</h2>
          <ul>
            {selectedOrder.details.map((product) => (
              <li key={product._id}>
                <strong>Product Name:</strong> {product.name} <br />
                <strong>Quantity:</strong> {product.quantity} <br />
                <strong>Price:</strong> {product.price.toFixed(2)} đ
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary mt-3" onClick={() => setSelectedOrder(null)}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
    