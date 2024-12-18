'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlices';

function ProductCard({ data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('38');
  const [selectedColor, setSelectedColor] = useState('white');
  const [promotionalProducts, setPromotionalProducts] = useState([]);

    useEffect(() => {
        const fetchPromotionalProducts = async () => {
          try {
            const response = await fetch('http://localhost:3000/api/promotional-products');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPromotionalProducts(data);
          } catch (error) {
            console.error('Error fetching promotional products:', error);
          }
        };
    
        fetchPromotionalProducts();
      }, []);
    

  const handleAddToCart = (itemId, quantity, selectedSize, selectedColor) => {
    const item = data.find(product => product._id === itemId);
    if (item) {
      dispatch(addToCart({ item, quantity, size: selectedSize, color: selectedColor }));
      console.log('Added to cart successfully!');
      router.push('/cart');
    } else {
      console.error('Item not found in data');
    }
  };

  const handleDetail = (id) => {
    router.push(`/products/${id}`);
  };

  const getPromotionForProduct = (productId) => {
    const promoProduct = promotionalProducts.find(promo => promo.id_product?._id === productId);

    if (promoProduct && promoProduct.id_promotional) {
        return promoProduct.id_promotional;
    }
    return null;
  }

  return (
    <>
        {Array.isArray(data) ? (
      data.map((product) => {
          const { _id, name, image, price, rating } = product;

          const promotion = getPromotionForProduct(_id);
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

        // Calculate the number of full stars and half stars
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const totalStars = 5;

        return (
          <div className="col-sm-6 col-md-4 col-lg-3 my-3" key={_id}>
            <div className="nav-product-item">
              <div className="nav-product-item-img">
                  <Link href={`/products/${_id}`}>
                    <img
                      src={image.startsWith('http') ? image : `http://localhost:3000/${image}`}
                      alt={name}
                      style={{ height: "250px", width: "100%" }}
                    />
                  </Link>
              </div>
              <div className="nav-product-item-name" >
                <h3 style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    height : '45px'
                  }}>{name}</h3>
              </div>
              <div
                className="nav-product-item-price-sale"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  className="nav-product-item-price"
                  style={{
                    marginBottom: '8px'
                  }}
                >
                  <h4>{formattedDiscountedPrice}</h4>
                </div>
                <div className="nav-product-item-sale">
                    {promotion && <del>{originalPrice}</del>}
                </div>
              </div>
            
              {promotion &&   <div className="nav-product-item-sale-top-img">
                <span>Giảm {discountPercentage}%</span>
              </div>}
              <div className="nav-product-item-start">
                <div className="nav-product-item-start-items">
                  {[...Array(fullStars)].map((_, index) => (
                    <i key={`full-${index}`} className="bi bi-star-fill" aria-hidden="true"></i>
                  ))}
                  {hasHalfStar && (
                    <i className="bi bi-star-half" aria-hidden="true"></i>
                  )}
                  {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
                    <i key={`empty-${index}`} className="bi bi-star" aria-hidden="true"></i>
                  ))}
                </div>
                {/* <div className="nav-product-item-start-danhgia">
                  <span>(55 Đánh Giá)</span>
                </div> */}
              </div>
              <div className="nav-product-item-view-heart-return">
                <div className="nav-product-item-view">
                  <a href="#">
                    <i className="bi bi-eye" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="nav-product-item-heart">
                  <a href="#">
                    <i className="bi bi-heart" aria-hidden="true"></i>
                  </a>
                </div>
                <div className="nav-product-item-return">
                  <a href="#">
                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <div className="nav-product-item-button">
                <div className="nav-product-item-button-add-to-cart">
                  <button
                    className="detail_addtocart"
                    onClick={() => handleAddToCart(_id, quantity, selectedSize, selectedColor)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
                <div className="nav-product-item-button-buy-now">
                  <button onClick={() => handleDetail(_id)}>Xem Chi Tiết</button>
                </div>
              </div>
            </div>
          </div>
        );
      })
     ) : (
        <p>Không có sản phẩm</p>
        )}
    </>
  );
}

export default ProductCard;