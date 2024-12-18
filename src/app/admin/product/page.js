"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';

// Function to fetch data from the API
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Product() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [promotionalProducts, setPromotionalProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);

    // Fetch data based on the current page
    const { data: productData, error, isLoading } = useSWR(
        `https://star-backend-ragw.onrender.com/products/page?page=${currentPage}&limit=5`,
        fetcher,
        {
            refreshInterval: 10000, // Auto-refresh every 10 seconds
        }
    );

    const fetchPromotionalProducts = async () => {
        try {
            const response = await axios.get('https://star-backend-ragw.onrender.com/api/promotional-products');
            setPromotionalProducts(response.data);
        } catch (error) {
            console.error('Error fetching promotional products:', error);
        }
    };

    const fetchPromotions = async () => {
        try {
            const response = await axios.get('https://star-backend-ragw.onrender.com/api/promotions');
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };
    useEffect(() => {
        fetchPromotionalProducts()
        fetchPromotions()
    }, [])

    // Handle delete action
    const deleteItem = async (itemId) => {
        if (confirm('Bạn có chắc chắn muốn xóa không?')) {
            try {
                const response = await fetch(`https://star-backend-ragw.onrender.com/products/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    alert('Sản phẩm đã được xóa thành công');
                    mutate(); // SWR's mutate to re-fetch the data
                } else {
                    alert('Đã có lỗi xảy ra: ' + data.message);
                }
            } catch (error) {
                alert('Lỗi mạng: ' + error.message);
            }
        }
    };

    const handleAssignPromotion = async (productId, promotionId) => {
        try {
            const response = await fetch('https://star-backend-ragw.onrender.com/api/promotional-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_product: productId,
                    id_promotional: promotionId,
                }),
            });
            if(!response.ok) {
                const message = await response.json()
                throw new Error(message.error || "Fail to assign promotion");
            }

            fetchPromotionalProducts();
            alert("Assign promotion successful");
        } catch (error) {
            alert(error.message)
            console.error('Error assigning promotion:', error);
        }
    };

  const handleRemovePromotion = async (promotionalProductId,productId) => {
        try {
             const response = await fetch(`https://star-backend-ragw.onrender.com/api/promotional-products/${promotionalProductId}`,{
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json',
                 },
             })
            if(!response.ok) {
                 const message = await response.json()
                throw new Error(message.error || "Fail to unassign promotion");
             }
            fetchPromotionalProducts();
            alert("Unassign promotion successful");
        } catch (error) {
            console.error('Error unassigning promotion:', error);
            alert(error.message)
         }
    };


    // Update totalPages and currentPage based on the fetched data
    useEffect(() => {
        if (productData) {
            setTotalPages(productData.countPages);
            setCurrentPage(productData.currentPage);
        }
    }, [productData]);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleGoTo = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPromotionalProductForProduct = (productId) => {
        return promotionalProducts.find(promo => promo.id_product?._id === productId);
    };



    if (error) return <div>Lỗi load dữ liệu.</div>;
    if (isLoading) return <div>Đang tải...</div>;

    // Generate page numbers for pagination
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Products</h3>
                <div>
                    <a href="/admin/category" className="btn btn-outline-success rounded-0">Manage Categories</a>
                    <Link href="/admin/product/add" className="btn btn-primary rounded-0">Add Product</Link>
                </div>
            </div>
            <div className="row">
                {/* Cards displaying statistics */}
                <div className="col-md-3 mb-4">
                    <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
                        <div className="card-body text-end">
                            <div className="display-6 d-flex justify-content-between">
                                <i className="fal fa-box"></i>
                                {productData?.countPro || 0}
                            </div>
                            PRODUCTS
                        </div>
                    </div>
                </div>
                {/* Add more statistics cards as needed */}
            </div>

            <div className="card rounded-0 border-0 shadow-sm">
                <div className="card-body">
                    <table className="table text-center">
                        <thead>
                        <tr>
                            <th className="text-start" colSpan="2">Product</th>
                            <th>Price</th>
                            <th>Instock</th>
                            <th>Rating</th>
                            <th>Promotion</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody className="align-middle">
                        {productData?.result?.map(product => {
                            const { _id, name, image, price, rating, inventory } = product;
                            const promotionalProduct = getPromotionalProductForProduct(_id);
                            const promotion = promotionalProduct?.id_promotional;

                              let discountedPrice = price;
                                let discountPercentage = 0;
                                if(promotion){
                                    discountPercentage = promotion.percent_discount;
                                     discountedPrice = price * (1 - discountPercentage / 100);
                                }
                            
                                const formattedDiscountedPrice = discountedPrice.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                  });
                                const originalPrice = price.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                });
                            const fullStars = Math.floor(rating);
                            const hasHalfStar = rating % 1 !== 0;

                            return (
                                <tr key={_id}>
                                    <td style={{ width: "64px" }}>
                                        <img src={`https://star-backend-ragw.onrender.com/img/${image}`} alt={name} className="w-100" />
                                    </td>
                                    <td className="text-start">
                                        <strong>{name}</strong>
                                        <br />
                                        <small>
                                            Id: <strong>{_id}</strong> |
                                            Category: <a href="#" className="text-decoration-none fw-bold">NIKE</a>
                                        </small>
                                    </td>
                                    <td>
                                       {formattedDiscountedPrice}
                                        <br/>
                                        <del>{originalPrice}</del>
                                    </td>
                                    <td>{inventory}</td>
                                    <td>
                                        {rating}
                                        <br />
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-star ${i < fullStars ? 'fas text-warning' : 'far text-warning'}`}
                                            ></i>
                                        ))}
                                        {hasHalfStar && <i className="fas fa-star-half-alt text-warning"></i>}
                                    </td>
                                    <td>
                                      {promotion ? (
                                          <span>{promotion?.percent_discount}%
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-1"
                                                onClick={() => handleRemovePromotion(promotionalProduct?._id, _id)}
                                            >
                                                Remove
                                            </button>
                                        </span>
                                      ) : (
                                          <span>0%

                                          </span>
                                      )}
                                  </td>
                                    <td>
                                        <Link href={`/admin/product/${_id}`} className="btn btn-primary btn-sm">
                                            <i className="fas fa-eye fa-fw"></i>
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => deleteItem(_id)}
                                        >
                                            <i className="fas fa-times fa-fw"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pagination-controls d-flex justify-content-between">
                <button
                    onClick={handlePrev}
                    className="pagination-item"
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-arrow-left-short"></i>
                </button>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handleGoTo(page)}
                        className={`pagination-item ${page === currentPage ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={handleNext}
                    className="pagination-item"
                    disabled={currentPage === totalPages}
                >
                    <i className="bi bi-arrow-right-short"></i>
                </button>
            </div>
        </>
    );
}