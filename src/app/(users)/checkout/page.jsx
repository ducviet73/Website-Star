"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import "../../../../public/bootstrap/css/cart.css";
import { clearCart } from '@/redux/slices/cartSlices';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.items) || [];
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(state => state.auth.user);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("paymentMethod",paymentMethod)
    const total = useMemo(() => 
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0), 
        [cartItems]
    );
    

    useEffect(() => {
        // Lấy dữ liệu từ API
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                const data = response.data;
                setCities(data);
            })
            .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
    }, []);


    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setSelectedCity(cityId);
        const selectedCityObj = cities.find(city => city.Id === cityId);
        if (selectedCityObj) {
            setDistricts(selectedCityObj.Districts);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        }
    };
    

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        const selectedCityObj = cities.find(city => city.Districts.some(district => district.Id === districtId));
        const selectedDistrictObj = selectedCityObj?.Districts.find(district => district.Id === districtId);
        setWards(selectedDistrictObj?.Wards || []);
        setSelectedWard('');
    };

    const handleCheckout = async () => {
        if (!customerName || !customerEmail || !paymentMethod || !selectedCity || !selectedDistrict || !selectedWard) {
            setErrorMessage('Please provide all required information.');
            return;
        }
    
        setErrorMessage('');
        setIsSubmitting(true);
    };

    return (
        <div className="container my-5">
            <h1>Thanh Toán</h1>

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="customerName">Tên Khách Hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customerEmail">Email Khách Hàng</label>
                        <input
                            type="email"
                            className="form-control"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                        />
                    </div><div className="form-group">
                        <label htmlFor="shippingAddress">Địa Chỉ Giao Hàng</label>
                        <input
                            type="text"
                            className="form-control"
                            id="shippingAddress"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">Thành Phố</label>
                        <select
                        className="form-control"
                        id="city"
                        value={selectedCity}
                        onChange={handleCityChange}
                    >
                        <option value="">Chọn Thành Phố</option>
                        {cities.map(city => (
                            <option key={city.Id} value={city.Id}>{city.Name}</option>
                        ))}
                    </select>
                    
                    </div>
                    <div className="form-group">
                        <label htmlFor="district">Quận/Huyện</label>
                        <select
                            className="form-control"
                            id="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        >
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map(district => (
                                <option key={district.Id} value={district.Id}>{district.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ward">Phường/Xã</label>
                        <select
                            className="form-control"
                            id="ward"
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                        >
                            <option value="">Chọn Phường/Xã</option>
                            {wards.map(ward => (
                                <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Phương Thức Thanh Toán</label>
                        <select
                            className="form-control"
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}required
                            >
                                <option value="">Chọn Phương Thức Thanh Toán</option>
                                <option value="cash">Thanh Toán Khi Nhận Hàng</option>
                                <option value="card">Thanh Toán Qua Thẻ</option>
                            </select>
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang Gửi...' : 'Đặt Hàng'}
                        </button>
                    </div>
                    <div className="col-md-6">
                        <h2>Giỏ Hàng</h2>
                        <div className="cart-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="row">
                                        <div className="col-4">
                                        <img
                                        src={item.image.startsWith('http') ? item.image : `http://localhost:3000/${item.image}`}
                                        alt={item.image}
                                            style={{ height: "250px", width: "100%" }}
                                        />                                        </div>
                                        <div className="col-8">
                                            <h5>{item.name}</h5>
                                            <p>Số lượng: {item.quantity}</p>
                                            <p>Giá: {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                            </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="total-amount">
                            <h4 style={{marginTop: "10px"}}>
                                Tổng Tiền: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} 
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    export default CheckoutPage;


