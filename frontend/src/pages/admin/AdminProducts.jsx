import { useState, useEffect } from "react";
import "../../styles/admin.css";
import { getAllProducts } from "../../api/productService";
import { createProductAdmin, updateProductAdmin, deleteProductAdmin, uploadProductImageAdmin, deleteProductImageAdmin } from "../../api/adminService";
import axiosInstance from "../../api/axiosInstance";

const emptyForm = {
    category_id: "", name: "", description: "", sku: "",
    price: "", discount: "0", stock: "", brand: "", status: "active"
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");
const [selectedFile, setSelectedFile] = useState(null);
const [productImages, setProductImages] = useState([]);
    const fetchProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    const fetchCategories = async () => {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.categories);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (editingId) {
                await updateProductAdmin(editingId, formData);
                setMessage("Product updated successfully");
            } else {
                await createProductAdmin(formData);
                setMessage("Product created successfully");
            }
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to save product");
        }
    };

    const handleEdit = (product) => {
    setFormData({
        category_id: product.category_id,
        name: product.name,
        description: product.description || "",
        sku: product.sku,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        brand: product.brand || "",
        status: product.status
    });
    setEditingId(product.id);
    setShowForm(true);
    fetchProductImages(product.id);
};
    const handleImageUpload = async () => {
    if (!selectedFile || !editingId) {
        setMessage("Please select an image and save the product first");
        return;
    }

    try {
        await uploadProductImageAdmin(editingId, selectedFile, false);
        setMessage("Image uploaded successfully");
        setSelectedFile(null);
        fetchProductImages(editingId);
    } catch (err) {
        setMessage(err.response?.data?.message || "Failed to upload image");
    }
};

const handleImageDelete = async (imageId) => {
    try {
        await deleteProductImageAdmin(imageId);
        fetchProductImages(editingId);
    } catch (err) {
        setMessage("Failed to delete image");
    }
};
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await deleteProductAdmin(id);
            fetchProducts();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete product");
        }
    };
    const fetchProductImages = async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    setProductImages(response.data.product.images || []);
};

    return (
    <div className="admin-page">

        {/* ================= HEADER ================= */}

        <div className="admin-page-header">

            <div>
                <h2>Manage Products</h2>

                <p>
                    Manage your products, inventory and images.
                </p>
            </div>

            <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setFormData(emptyForm);
                    setProductImages([]);
                }}
            >
                {showForm ? "Cancel" : "+ Add Product"}
            </button>

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (
            <div className="admin-message">
                ✓ {message}
            </div>
        )}


        {/* ================= PRODUCT FORM ================= */}

        {showForm && (

            <form
                onSubmit={handleSubmit}
                className="admin-form"
            >

                <h3 className="admin-form-title">
                    {editingId
                        ? "Edit Product"
                        : "Create New Product"}
                </h3>


                <div className="admin-form-grid">


                    {/* CATEGORY */}

                    <div className="admin-form-group">

                        <label>
                            Category
                        </label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map((c) => (

                                <option
                                    key={c.id}
                                    value={c.id}
                                >
                                    {c.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* PRODUCT NAME */}

                    <div className="admin-form-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            name="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* SKU */}

                    <div className="admin-form-group">

                        <label>
                            SKU
                        </label>

                        <input
                            name="sku"
                            placeholder="Example: IP15-BLK-128"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* BRAND */}

                    <div className="admin-form-group">

                        <label>
                            Brand
                        </label>

                        <input
                            name="brand"
                            placeholder="Enter brand"
                            value={formData.brand}
                            onChange={handleChange}
                        />

                    </div>


                    {/* PRICE */}

                    <div className="admin-form-group">

                        <label>
                            Price (₹)
                        </label>

                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="69999"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* DISCOUNT */}

                    <div className="admin-form-group">

                        <label>
                            Discount (%)
                        </label>

                        <input
                            name="discount"
                            type="number"
                            step="0.01"
                            placeholder="10"
                            value={formData.discount}
                            onChange={handleChange}
                        />

                    </div>


                    {/* STOCK */}

                    <div className="admin-form-group">

                        <label>
                            Stock
                        </label>

                        <input
                            name="stock"
                            type="number"
                            placeholder="100"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* STATUS */}

                    <div className="admin-form-group">

                        <label>
                            Product Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="admin-form-group full">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Describe your product..."
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                </div>


                {/* ================= SAVE BUTTON ================= */}

                <div className="admin-form-actions">

                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                    >
                        {editingId
                            ? "✓ Update Product"
                            : "+ Create Product"}
                    </button>

                </div>


                {/* ================= IMAGES ================= */}

                {editingId && (

                    <div className="admin-image-section">

                        <h3>
                            Product Images
                        </h3>

                        <p>
                            Upload and manage product images.
                        </p>


                        <div className="admin-image-grid">

                            {productImages.map((img) => (

                                <div
                                    key={img.id}
                                    className="admin-image-item"
                                >

                                    <img
                                        src={`http://localhost:5000${img.image_url}`}
                                        alt=""
                                    />

                                    <button
                                        type="button"
                                        className="admin-image-delete"
                                        onClick={() =>
                                            handleImageDelete(img.id)
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            ))}

                        </div>


                        {/* Upload */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                flexWrap: "wrap"
                            }}
                        >

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setSelectedFile(
                                        e.target.files[0]
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="admin-btn admin-btn-primary"
                                onClick={handleImageUpload}
                            >
                                📷 Upload Image
                            </button>

                        </div>

                    </div>

                )}

            </form>

        )}


        {/* ================= PRODUCTS TABLE ================= */}

        <div className="admin-table-wrapper">

            <table className="admin-table">

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Stock
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {products.map((p) => (

                        <tr key={p.id}>

                            {/* PRODUCT */}

                            <td>

                                <div className="admin-product-info">

                                    {p.primary_image ? (

                                        <img
                                            className="admin-product-image"
                                            src={`http://localhost:5000${p.primary_image}`}
                                            alt={p.name}
                                        />

                                    ) : (

                                        <div className="admin-product-image">
                                            📦
                                        </div>

                                    )}


                                    <div>

                                        <div className="admin-product-name">
                                            {p.name}
                                        </div>

                                        <div className="admin-product-meta">
                                            {p.brand || "No brand"}
                                            {" • "}
                                            SKU: {p.sku}
                                        </div>

                                    </div>

                                </div>

                            </td>


                            {/* PRICE */}

                            <td>

                                <strong>
                                    ₹{p.price}
                                </strong>

                            </td>


                            {/* STOCK */}

                            <td>

                                {p.stock > 0 ? (

                                    <span className="admin-status status-delivered">
                                        {p.stock} available
                                    </span>

                                ) : (

                                    <span className="admin-status status-cancelled">
                                        Out of stock
                                    </span>

                                )}

                            </td>


                            {/* STATUS */}

                            <td>

                                <span
                                    className={`admin-status ${
                                        p.status === "active"
                                            ? "status-delivered"
                                            : "status-cancelled"
                                    }`}
                                >
                                    {p.status}
                                </span>

                            </td>


                            {/* ACTIONS */}

                            <td>

                                <div className="admin-actions">

                                    <button
                                        className="admin-action-btn admin-action-edit"
                                        onClick={() =>
                                            handleEdit(p)
                                        }
                                        title="Edit product"
                                    >
                                        ✏️
                                    </button>


                                    <button
                                        className="admin-action-btn admin-action-delete"
                                        onClick={() =>
                                            handleDelete(p.id)
                                        }
                                        title="Delete product"
                                    >
                                        🗑️
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    </div>
);
};

export default AdminProducts;