import { useState, useEffect } from "react";
import "../../styles/admin.css";
import axiosInstance from "../../api/axiosInstance";
import { createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from "../../api/adminService";

const emptyForm = { name: "", description: "", is_active: 1 };

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const fetchCategories = async () => {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.categories);
    };

    useEffect(() => {
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
                await updateCategoryAdmin(editingId, formData);
                setMessage("Category updated");
            } else {
                await createCategoryAdmin(formData);
                setMessage("Category created");
            }
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(false);
            fetchCategories();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to save category");
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || "",
            is_active: category.is_active
        });
        setEditingId(category.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await deleteCategoryAdmin(id);
            fetchCategories();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to delete category (it may have products assigned)");
        }
    };

return (
    <div className="admin-page">

        {/* HEADER */}
        <div className="admin-page-header">

            <div>
                <h2>Manage Categories</h2>
                <p>Create and manage your product categories.</p>
            </div>

            <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                    setFormData(emptyForm);
                }}
            >
                {showForm ? "Cancel" : "+ Add Category"}
            </button>

        </div>


        {/* MESSAGE */}
        {message && (
            <div className="admin-message">
                ✓ {message}
            </div>
        )}


        {/* FORM */}
        {showForm && (
            <form
                onSubmit={handleSubmit}
                className="admin-form"
            >

                <h3>
                    {editingId
                        ? "Edit Category"
                        : "Create New Category"}
                </h3>


                <div className="admin-form-grid">

                    {/* NAME */}
                    <div className="admin-form-group">

                        <label>
                            Category Name
                        </label>

                        <input
                            name="name"
                            placeholder="Enter category name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}
                    <div className="admin-form-group full">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Enter category description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                </div>


                {/* FORM BUTTON */}
                <div style={{ marginTop: "20px" }}>

                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                    >
                        {editingId
                            ? "✓ Update Category"
                            : "+ Create Category"}
                    </button>

                </div>

            </form>
        )}


        {/* CATEGORY TABLE */}
        <div className="admin-table-wrapper">

            <table className="admin-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>

                </thead>


                <tbody>

                    {categories.map((c) => (

                        <tr key={c.id}>

                            <td>
                                <strong>
                                    {c.name}
                                </strong>
                            </td>

                            <td>
                                {c.description || "No description"}
                            </td>

                            <td>

                                <div className="admin-actions">

                                    {/* EDIT */}
                                    <button
                                        className="admin-action-btn admin-action-edit"
                                        onClick={() => handleEdit(c)}
                                        title="Edit category"
                                    >
                                        ✏️
                                    </button>


                                    {/* DELETE */}
                                    <button
                                        className="admin-action-btn admin-action-delete"
                                        onClick={() => handleDelete(c.id)}
                                        title="Delete category"
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

export default AdminCategories;