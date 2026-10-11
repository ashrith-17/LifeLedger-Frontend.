import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Items() {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        startDate: "",
        dueDate: "",
        cost: "",
        recurrence: "NONE",
        reminderEnabled: true,
        reminderDaysBefore: 7
    });

    const categories = [
        "Electronics",
        "Insurance",
        "Vehicle",
        "Subscription",
        "Documents",
        "Bills",
        "Appliance",
        "Warranty",
        "Other"
    ];


    /* LOAD ALL ITEMS */

    const loadItems = async () => {

        try {

            const response =
                await api.get("/items");

            setItems(response.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.clear();
                navigate("/login");

            } else {

                setError("Unable to load items");
            }

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadItems();
    }, []);


    /* SEARCH */

    const handleSearch = async (value) => {

        setSearch(value);

        if (!value.trim()) {

            loadItems();
            return;
        }

        try {

            setError("");

            const response =
                await api.get(
                    `/items/search?keyword=${encodeURIComponent(value)}`
                );

            setItems(response.data);

        } catch (error) {

            console.error(error);

            setError("Unable to search items");
        }
    };


    /* CATEGORY FILTER */

    const handleCategoryFilter = async (category) => {

        setCategoryFilter(category);

        if (!category) {

            loadItems();
            return;
        }

        try {

            setError("");

            const response =
                await api.get(
                    `/items/category?category=${encodeURIComponent(category)}`
                );

            setItems(response.data);

        } catch (error) {

            console.error(error);

            setError("Unable to filter items");
        }
    };


    /* CLEAR FILTERS */

    const clearFilters = () => {

        setSearch("");
        setCategoryFilter("");

        loadItems();
    };


    /* FORM */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };


    const resetForm = () => {

        setForm({
            title: "",
            category: "",
            description: "",
            startDate: "",
            dueDate: "",
            cost: "",
            recurrence: "NONE",
            reminderEnabled: true,
            reminderDaysBefore: 7
        });

        setEditingId(null);
        setShowForm(false);
    };


    /* CREATE / UPDATE */

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = {
                ...form,

                cost: form.cost
                    ? Number(form.cost)
                    : null,

                reminderDaysBefore:
                    form.reminderEnabled
                        ? Number(form.reminderDaysBefore)
                        : 0
            };


            if (editingId) {

                await api.put(
                    `/items/${editingId}`,
                    data
                );

            } else {

                await api.post(
                    "/items",
                    data
                );
            }


            await loadItems();

            clearFilters();

            resetForm();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save item"
            );
        }
    };


    /* EDIT */

    const handleEdit = (item) => {

        setForm({
            title: item.title || "",
            category: item.category || "",
            description: item.description || "",
            startDate: item.startDate || "",
            dueDate: item.dueDate || "",
            cost: item.cost || "",
            recurrence: item.recurrence || "NONE",
            reminderEnabled:
                item.reminderEnabled ?? true,
            reminderDaysBefore:
                item.reminderDaysBefore ?? 7
        });

        setEditingId(item.id);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    /* DELETE */

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this item?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/items/${id}`
            );

            await loadItems();

            clearFilters();

        } catch (error) {

            console.error(error);

            setError(
                "Unable to delete item"
            );
        }
    };


    if (loading) {

        return (
            <div className="loading">
                Loading your items...
            </div>
        );
    }


    return (

        <div className="items-page">

            {/* HEADER */}

            <div className="items-page-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <h1>
                        My Items
                    </h1>

                    <p>
                        Track everything important in your life.
                    </p>

                </div>

                <button
                    className="add-button"
                    onClick={() => {

                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }

                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "+ Add Item"}
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* SEARCH / FILTER */}

            <div className="filter-bar">

                <div className="search-box">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) =>
                            handleSearch(e.target.value)
                        }
                    />

                </div>


                <select
                    className="category-filter"
                    value={categoryFilter}
                    onChange={(e) =>
                        handleCategoryFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    {categories.map(category => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>


                {(search || categoryFilter) && (

                    <button
                        className="clear-filter"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                )}

            </div>


            {/* FORM */}

            {showForm && (

                <div className="item-form-card">

                    <h2>
                        {editingId
                            ? "Edit Item"
                            : "Add New Item"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Laptop Warranty"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(category => (

                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className="form-group full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Add some details..."
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Due / Expiry Date
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Cost
                                </label>

                                <input
                                    type="number"
                                    name="cost"
                                    placeholder="₹ 0"
                                    min="0"
                                    value={form.cost}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Recurrence
                                </label>

                                <select
                                    name="recurrence"
                                    value={form.recurrence}
                                    onChange={handleChange}
                                >

                                    <option value="NONE">
                                        One time
                                    </option>

                                    <option value="MONTHLY">
                                        Monthly
                                    </option>

                                    <option value="QUARTERLY">
                                        Quarterly
                                    </option>

                                    <option value="YEARLY">
                                        Yearly
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="reminder-box">

                            <label className="checkbox-label">

                                <input
                                    type="checkbox"
                                    name="reminderEnabled"
                                    checked={
                                        form.reminderEnabled
                                    }
                                    onChange={handleChange}
                                />

                                Enable reminder

                            </label>


                            {form.reminderEnabled && (

                                <div>

                                    <label>
                                        Remind me
                                    </label>

                                    <select
                                        name="reminderDaysBefore"
                                        value={
                                            form.reminderDaysBefore
                                        }
                                        onChange={handleChange}
                                    >

                                        <option value="1">
                                            1 day before
                                        </option>

                                        <option value="3">
                                            3 days before
                                        </option>

                                        <option value="7">
                                            7 days before
                                        </option>

                                        <option value="15">
                                            15 days before
                                        </option>

                                        <option value="30">
                                            30 days before
                                        </option>

                                    </select>

                                </div>

                            )}

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                onClick={resetForm}
                                className="secondary-button"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {editingId
                                    ? "Update Item"
                                    : "Save Item"}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ITEMS */}

            {items.length === 0 ? (

                <div className="empty-state large">

                    <h2>
                        No items found
                    </h2>

                    <p>
                        Try another search or category,
                        or add a new item.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() => {

                            clearFilters();
                            setShowForm(true);

                        }}
                    >
                        + Add Item
                    </button>

                </div>

            ) : (

                <div className="items-grid">

                    {items.map(item => (

                        <div
                            className="item-card"
                            key={item.id}
                        >

                            <div className="item-card-top">

                                <div>

                                    <span className="category-badge">
                                        {item.category}
                                    </span>

                                    <h2>
                                        {item.title}
                                    </h2>

                                </div>

                                <div className="item-menu">
    <span>LifeLedger</span>
</div>

                            </div>


                            {item.description && (

                                <p className="item-description">
                                    {item.description}
                                </p>

                            )}


                            <div className="item-details">

                                <div>

                                    <span>
                                        Due date
                                    </span>

                                    <strong>
                                        {new Date(
                                            item.dueDate
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    </strong>

                                </div>


                                {item.cost != null && (

                                    <div>

                                        <span>
                                            Cost
                                        </span>

                                        <strong>
                                            ₹{Number(
                                                item.cost
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                )}

                            </div>


                            <div className="item-card-footer">

                                <span>
                                    {item.reminderEnabled
                                        ? `🔔 ${item.reminderDaysBefore} days before`
                                        : "🔕 Reminder off"}
                                </span>


                                <div className="item-actions">

                                    <button
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                item.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Items;