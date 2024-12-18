"use client";
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useSWR from 'swr';
import Link from 'next/link';

// Fetcher function with error handling
const fetcher = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            console.error('Error response:', text);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetching error:', error);
        throw error;
    }
};

// Validation schema with Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[A-Z][a-z]*(?:[\s.,!?'-][A-Z][a-z]*)*$/, 'Tên phải bắt đầu bằng chữ cái viết hoa sau mỗi khoảng trắng và có thể chứa dấu câu')
        .required('Tên là bắt buộc'),
    category: Yup.string()
        .required('Danh mục là bắt buộc'),
    sale: Yup.number()
        .min(0, 'Khuyến mãi phải ít nhất là 0')
        .max(100, 'Khuyến mãi không được vượt quá 100')
        .required('Khuyến mãi là bắt buộc')
        .typeError('Khuyến mãi phải là số'),
    description: Yup.string()
        .matches(/^[\w\s.,!?]+$/, 'Mô tả chỉ có thể chứa chữ cái, số và dấu câu thông thường'),
    price: Yup.number()
        .min(0, 'Giá phải ít nhất là 0')
        .required('Giá là bắt buộc')
        .typeError('Giá phải là số'),
    content: Yup.string()
        .matches(/^[\w\s.,!?]+$/, 'Nội dung chỉ có thể chứa chữ cái, số và dấu câu thông thường'),
    view: Yup.number()
        .min(0, 'Số lượt xem phải ít nhất là 0')
        .typeError('Số lượt xem phải là số'),
    inventory: Yup.number()
        .min(0, 'Kho hàng phải ít nhất là 0')
        .required('Kho hàng là bắt buộc')
        .typeError('Kho hàng phải là số'),
    rating: Yup.number()
        .min(0, 'Đánh giá phải ít nhất là 0')
        .max(5, 'Đánh giá không được vượt quá 5')
        .typeError('Đánh giá phải là số'),
});

export default function ProductAdd() {
    // Fetch categories
    const { data: categories, error: categoriesError } = useSWR("http://localhost:3000/categories", fetcher);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: '',
            category: '',
            sale: '',
            description: '',
            price: '',
            content: '',
            view: '',
            inventory: '',
            rating: '',
            image: null,
            images: [],
        },
        validationSchema,
        onSubmit: async (values,{ resetForm }) => {
            const data = new FormData();
    
            // Thêm các trường không phải file vào FormData
            Object.keys(values).forEach(key => {
                if (values[key] !== '' && values[key] !== null && key !== 'image' && key !== 'images') {
                    data.append(key, values[key]);
                }
            });
    
            // Thêm tệp tin đơn
            if (values.image) {
                data.append('image', values.image);
            }
    
            // Thêm các tệp tin nhiều
            values.images.forEach(file => {
                data.append('images', file);
            });
    
            console.log('FormData to be sent:', data);
    
            try {
                const response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    body: data,
                });
    
                if (!response.ok) {
                    const text = await response.text();
                    console.error('Error response:', text);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Sản phẩm đã được thêm thành công!');
                resetForm(); 
            } catch (error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.');
        }
    }
    });
    
    // Error and loading states for categories
    if (categoriesError) return <p>Error fetching categories: {categoriesError.message}</p>;
    if (!categories) return <p>Loading categories...</p>;

    return (
        <>
            <div className="d-flex justify-content-between">
                <h3 className="mb-4">Add Product</h3>
                <Link href="/admin/product" className="btn btn-outline-secondary rounded-0">
                    <i className="far fa-long-arrow-left"></i> Back
                </Link>
            </div>
            <form className="row" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                {/* Basic Info Section */}
                <div className="col-md-8 mb-4">
                    <div className="card rounded-0 border-0 shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Basic Info</h6>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="name" className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-0"
                                        id="name"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-danger">{formik.errors.name}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="category" className="form-label">Category *</label>
                                    <select
                                        id="category"
                                        className="form-select rounded-0"
                                        {...formik.getFieldProps('category')}
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.category && formik.errors.category && (
                                        <div className="text-danger">{formik.errors.category}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <h6 className="pb-3 border-bottom">Price</h6>
                                <div className="col mb-3">
                                    <label htmlFor="price" className="form-label">Price *</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="price"
                                        min="0"
                                        {...formik.getFieldProps('price')}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <div className="text-danger">{formik.errors.price}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="sale" className="form-label">Sale</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="sale"
                                        min="0"
                                        {...formik.getFieldProps('sale')}
                                    />
                                    {formik.touched.sale && formik.errors.sale && (
                                        <div className="text-danger">{formik.errors.sale}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="rating" className="form-label">Rating</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="rating"
                                        min="0"
                                        max="5"
                                        {...formik.getFieldProps('rating')}
                                    />
                                    {formik.touched.rating && formik.errors.rating && (
                                        <div className="text-danger">{formik.errors.rating}</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="view" className="form-label">View Count</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="view"
                                        min="0"
                                        {...formik.getFieldProps('view')}
                                    />
                                    {formik.touched.view && formik.errors.view && (
                                        <div className="text-danger">{formik.errors.view}</div>
                                    )}
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="inventory" className="form-label">Inventory *</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-0"
                                        id="inventory"
                                        min="0"
                                        {...formik.getFieldProps('inventory')}
                                    />
                                    {formik.touched.inventory && formik.errors.inventory && (
                                        <div className="text-danger">{formik.errors.inventory}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Thông Tin</h6>
                            <div className="row">
                                <div className="col mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control rounded-0"
                                        id="description"
                                        rows="6"
                                        {...formik.getFieldProps('description')}
                                    ></textarea>
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="content" className="form-label">Content</label>
                                    <textarea
                                        className="form-control rounded-0"
                                        id="content"
                                        rows="4"
                                        {...formik.getFieldProps('content')}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="col-md-4 mb-4">
                    <div className="card rounded-0 border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="pb-3 border-bottom">Images</h6>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Product Image *</label>
                                <input
                                    className="form-control rounded-0"
                                    type="file"
                                    id="image"
                                    onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
                                    required
                                />
                                <div className="bg-secondary-subtle mb-3 p-2 text-center">
                                    {formik.values.image && (
                                        <img src={URL.createObjectURL(formik.values.image)} className="w-50" alt="Selected" />
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="images" className="form-label">More Product Images</label>
                                <input
                                    className="form-control rounded-0"
                                    type="file"
                                    id="images"
                                    multiple
                                    onChange={(e) => formik.setFieldValue('images', Array.from(e.target.files))}
                                />
                                <div className="bg-secondary-subtle mb-3 p-2 text-center d-flex">
                                    {formik.values.images && Array.isArray(formik.values.images) ? (
                                        formik.values.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(img)}
                                                className="w-25"
                                                alt={`Selected ${index}`}
                                            />
                                        ))
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg rounded-0 mt-4 w-100">Create Product</button>
                </div>
            </form>
        </>
    );
}
