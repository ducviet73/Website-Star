"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Dashboard() {
    const user = useSelector(state => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [incomes, setIncomes] = useState(0);
    const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user?._id) {
            // Fetch user-specific orders
            axios.get(`http://localhost:3000/orders/user/${user._id}`)
                .then(response => {
                    setOrders(response.data);
                })
                .catch(error => {
                    setErrorMessage('Lỗi khi lấy dữ liệu đơn hàng.');
                    console.error('Error fetching order history:', error);
                });

            // Fetch products count
            axios.get(`http://localhost:3000/products/count`)
                .then(response => {
                    setProductsCount(response.data.count);
                })
                .catch(error => {
                    setErrorMessage('Lỗi khi lấy số lượng sản phẩm.');
                    console.error('Error fetching products count:', error);
                });

            // Fetch customers count
            axios.get(`http://localhost:3000/users/count`)
                .then(response => {
                    setCustomersCount(response.data.count);
                })
                .catch(error => {
                    setErrorMessage('Lỗi khi lấy số lượng khách hàng.');
                    console.error('Error fetching customers count:', error);
                });

            // Fetch total incomes
            axios.get(`http://localhost:3000/orders/incomes/total`)
                .then(response => {
                    setIncomes(response.data.total);
                })
                .catch(error => {
                    setErrorMessage('Lỗi khi lấy tổng doanh thu.');
                    console.error('Error fetching incomes:', error);
                });

          
            // axios.get('http://localhost:3000/orders/total-orders')
            //     .then(response => {
            //         setDeliveredOrdersCount(response.data.length);
            //     })
            //     .catch(error => {
            //         setErrorMessage('Lỗi khi lấy số lượng đơn hàng đã giao.');
            //         console.error('Error fetching delivered orders:', error);
            //     });
        }
    }, [user?._id]);

    const totalOrders = orders.length;

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Bảng Điều Khiển</h3>
            </div>
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
                        <div className="card-body text-end">
                            <div className="display-6 d-flex justify-content-between">
                                <i className="fal fa-file-invoice-dollar"></i>
                                // {totalOrders}
                            </div>
                            ĐƠN HÀNG
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card border-0 rounded-0 bg-warning-subtle text-warning">
                        <div className="card-body text-end">
                            <div className="display-6 d-flex justify-content-between">
                                <i className="fal fa-boxes"></i>
                                {productsCount}
                            </div>
                            SẢN PHẨM
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card border-0 rounded-0 bg-danger-subtle text-danger">
                        <div className="card-body text-end">
                            <div className="display-6 d-flex justify-content-between">
                                <i className="fal fa-users"></i>
                                {customersCount}
                            </div>
                            KHÁCH HÀNG
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card border-0 rounded-0 bg-success-subtle text-success">
                        <div className="card-body text-end">
                            <div className="display-6 d-flex justify-content-between">
                                <i className="fal fa-chart-line"></i>
                                {incomes.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            DOANH THU
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex border-bottom pb-2 justify-content-between">
                                <h6 className="mb-0">
                                    <i className="fal fa-file-invoice-dollar fa-lg"></i>
                                    Đơn Hàng Gần Đây
                                </h6>
                                <small>
                                    <a href="#" className="text-decoration-none">Tất cả Đơn Hàng</a>
                                </small>
                            </div>
                            {orders.slice(0, 3).map(order => (
                                <div key={order._id} className="d-flex text-body-secondary pt-3">
                                    <div className={`p-2 me-2 ${order.status === 'pending' ? 'bg-warning' : order.status === 'completed' ? 'bg-success' : 'bg-danger'} text-white`}>
                                        <i className="fal fa-receipt"></i>
                                    </div>
                                    <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                                        <strong className="d-flex justify-content-between">
                                            Đơn #{order._id}
                                            <div>
                                                <span className="badge text-bg-warning">
                                                    <i className="far fa-box"></i> {order.details.reduce((sum, item) => sum + item.quantity, 0)}
                                                </span>
                                                <span className="badge bg-success-subtle text-success">
                                                    <i className="far fa-money-bill-wave"></i> {order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </span>
                                            </div>
                                        </strong>
                                        Đặt bởi <i>{user?.name || 'Khách vãng lai'}</i> lúc {new Date(order.createdAt).toLocaleString()}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex border-bottom pb-2 justify-content-between">
                                <h6 className="mb-0">
                                    <i className="fal fa-stars fa-lg"></i>
                                    Recent Ratings
                                </h6>
                                <small>
                                    <a href="#" className="text-decoration-none">All Ratings</a>
                                </small>
                            </div>
                            {/* Mockup for recent ratings - replace with actual data */}
                            <div className="d-flex text-body-secondary pt-3">
                                <i className="far fa-comment-alt-smile"></i>
                                <a href="#" className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary">
                                    <strong className="d-flex justify-content-between">
                                        iPhone 15 Pro Max 256GB Gold Rose
                                        <div className="text-warning">
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                    </strong>
                                    Sản phẩm xịn, giá tốt!
                                </a>
                            </div>
                            {/* Repeat for more ratings */}
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex border-bottom pb-2 justify-content-between">
                                <h6 className="mb-0"><i className="fal fa-chart-pie fa-lg"></i>Statistics</h6>
                            </div>
                            <div className="d-flex flex-column text-body-secondary pt-3">
                                <strong>Orders Delivered</strong>
                                <span>{deliveredOrdersCount}</span>
                                <strong>Products</strong>
                                <span>{productsCount}</span>
                                <strong>Customers</strong>
                                <span>{customersCount}</span>
                                <strong>Incomes</strong>
                                <span>{incomes.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        </>
    );
}
