"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// UserForm Component
const UserForm = ({ userId, users, onUserUpdated, onClose }) => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'user'
    });

    useEffect(() => {
        if (userId && users) {
            const existingUser = users.find(user => user._id === userId); // Find user from list
            if (existingUser) {
                setUser(existingUser); // Set existing user data to the form
            }
        }
    }, [userId, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = userId
            ? axios.put(`http://localhost:3000/users/${userId}`, user) // Edit user
            : axios.post('http://localhost:3000/users', user); // Add new user

        request
            .then(response => {
                alert(userId ? 'Cập nhật người dùng thành công' : 'Thêm người dùng thành công');
                onUserUpdated(response.data);
                onClose();
            })
            .catch(error => {
                if (error.response?.data?.message) {
                    alert(error.response.data.message);
                } else {
                    console.error("Có lỗi xảy ra:", error);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Enter your username" // Placeholder for username
                    required
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Enter your email" // Placeholder for email
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={user.password}
                    onChange={handleChange}
                    placeholder={userId ? "Leave empty if you don't want to change the password" : "Enter a new password"} // Placeholder for password
                />
            </div>
            <div className="form-group">
                <label>Phone</label>
                <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number" // Placeholder for phone number
                    required
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={user.address}
                    onChange={handleChange}
                    placeholder="Enter your address" // Placeholder for address
                    required
                />
            </div>
            <div className="form-group">
                <label>Role</label>
                <select
                    name="role"
                    className="form-control"
                    value={user.role}
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>Cancel</button>
        </form>
    );
};
    

// RoleUpdateForm Component
const RoleUpdateForm = ({ userId, onRoleUpdated, onClose }) => {
    const [role, setRole] = useState('user');

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3000/users/${userId}`)
                .then(response => setRole(response.data.role))
                .catch(error => console.error("Có lỗi xảy ra:", error));
        }
    }, [userId]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/users/${userId}`, { role })
            .then(response => {
                onRoleUpdated();
            })
            .catch(error => console.error("Có lỗi xảy ra:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control" value={role} onChange={handleRoleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Update Role</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>Cancel</button>
        </form>
    );
};

// UserList Component
const UserListWithRoleUpdate = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        admins: 0,
        regularUsers: 0,
    });
    const [showForm, setShowForm] = useState(false);
    const [showRoleUpdateForm, setShowRoleUpdateForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [updatingRoleUserId, setUpdatingRoleUserId] = useState(null);

    // Fetch user list and stats when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users');
                const userList = response.data;
                setUsers(userList);
                setUserStats({
                    totalUsers: userList.length,
                    admins: userList.filter(user => user.role === 'admin').length,
                    regularUsers: userList.filter(user => user.role === 'user').length,
                });
            } catch (error) {
                console.error("Có lỗi xảy ra:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // Run only once when the component is mounted

    // Handle deleting user
    const deleteUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await axios.delete(`http://localhost:3000/users/${id}`);

                const userToDelete = users.find(user => user._id === id);
                if (userToDelete) {
                    setUsers(prevUsers => prevUsers.filter(user => user._id !== id));

                    setUserStats(prevStats => ({
                        ...prevStats,
                        totalUsers: prevStats.totalUsers - 1,
                        admins: userToDelete.role === 'admin' ? prevStats.admins - 1 : prevStats.admins,
                        regularUsers: userToDelete.role === 'user' ? prevStats.regularUsers - 1 : prevStats.regularUsers,
                    }));

                    alert('Người dùng đã được xóa thành công.');
                } else {
                    alert('Không tìm thấy người dùng để xóa.');
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi xóa người dùng:", error);
                alert('Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.');
            }
        }
    };

    // Toggle add user form
    const handleAddUserClick = () => {
        setEditingUserId(null);
        setShowForm(true);
    };

    // Toggle edit user form
    const handleEditUserClick = (userId) => {
        setEditingUserId(userId);
        setShowForm(true);
    };

    // Handle role update form toggle
    const handleRoleUpdateClick = (userId) => {
        setUpdatingRoleUserId(userId);
        setShowRoleUpdateForm(true);
    };

    // Trigger re-render after user is updated
    const handleUserUpdated = () => {
        setShowForm(false);
        setUsers(prevUsers => [...prevUsers]); // Re-fetch user data
    };

    // Trigger re-render after role is updated
    const handleRoleUpdated = () => {
        setShowRoleUpdateForm(false);
        setUsers(prevUsers => [...prevUsers]); // Re-fetch user data
    };

    // Close form without saving
    const handleCloseForm = () => {
        setShowForm(false);
    };

    // Close role update form without saving
    const handleCloseRoleUpdateForm = () => {
        setShowRoleUpdateForm(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Danh Sách Người Dùng</h2>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-primary" onClick={handleAddUserClick}>
                        <i className="fas fa-user-plus me-2"></i> Thêm Người Dùng
                    </button>
                    <div>
                        <h4>Thống Kê Người Dùng</h4>
                        <p className="mb-1"><strong>Tổng số người dùng:</strong> {userStats.totalUsers}</p>
                        <p className="mb-1"><strong>Quản trị viên:</strong> {userStats.admins}</p>
                        <p><strong>Người dùng bình thường:</strong> {userStats.regularUsers}</p>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={user._id}>
                            <td>{i + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>
                                <span className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditUserClick(user._id)}>
                                    <i className="fas fa-edit"></i> Sửa
                                </button>
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleRoleUpdateClick(user._id)}>
                                    <i className="fas fa-user-cog"></i> Cập nhật Role
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user._id)}>
                                    <i className="fas fa-trash-alt"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingUserId ? 'Chỉnh sửa Người Dùng' : 'Thêm Người Dùng'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
                            </div>
                            <div className="modal-body">
                                <UserForm userId={editingUserId} onUserUpdated={handleUserUpdated} onClose={handleCloseForm} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRoleUpdateForm && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật Role</h5>
                                <button type="button" className="btn-close" onClick={handleCloseRoleUpdateForm}></button>
                            </div>
                            <div className="modal-body">
                                <RoleUpdateForm userId={updatingRoleUserId} onRoleUpdated={handleRoleUpdated} onClose={handleCloseRoleUpdateForm} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UserListWithRoleUpdate;
