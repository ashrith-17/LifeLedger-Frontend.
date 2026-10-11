import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const dashboardResponse =
                    await api.get("/dashboard");

                const itemsResponse =
                    await api.get("/items");

                setDashboard(
                    dashboardResponse.data
                );

                setItems(
                    itemsResponse.data
                );

            } catch (error) {

                console.error(error);

                if (error.response?.status === 401) {

                    localStorage.clear();
                    navigate("/login");

                } else {

                    setError(
                        "Unable to load dashboard"
                    );
                }
            }
        };

        loadDashboard();

    }, [navigate]);


    const logout = () => {

        localStorage.clear();
        navigate("/login");
    };


    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const getDaysRemaining = (dueDate) => {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);

        due.setHours(0, 0, 0, 0);

        return Math.ceil(
            (due - today) /
            (1000 * 60 * 60 * 24)
        );
    };


    const getItemStatus = (dueDate) => {

        const days =
            getDaysRemaining(dueDate);

        if (days < 0) {

            return {
                text: "Overdue",
                className: "status-overdue"
            };
        }

        if (days <= 30) {

            return {
                text: "Due Soon",
                className: "status-soon"
            };
        }

        return {
            text: "Upcoming",
            className: "status-upcoming"
        };
    };


    if (error) {

        return (
            <div className="error">
                {error}
            </div>
        );
    }


    if (!dashboard) {

        return (
            <div className="loading">
                Loading LifeLedger...
            </div>
        );
    }


    return (

        <div className="dashboard-layout">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo">
                    LifeLedger
                </div>


                <nav>

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/items")
                        }
                    >
                        <span>📋</span>
                        My Items
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/reminders")
                        }
                    >
                        <span>🔔</span>
                        Reminders
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/history")
                        }
                    >
                        <span>🕒</span>
                        History
                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="user-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div>

                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>

                        </div>

                    </div>


                    <button
                        className="logout"
                        onClick={logout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* MAIN */}

            <main className="main-content">

                {/* TOPBAR */}

                <div className="topbar">

                    <div>

                        <span className="dashboard-label">
                            OVERVIEW
                        </span>

                        <h1>
                            Good day, {user?.name || "User"} 👋
                        </h1>

                        <p>
                            Here's what's happening with your LifeLedger.
                        </p>

                    </div>


                    <button
                        className="add-button"
                        onClick={() =>
                            navigate("/items")
                        }
                    >
                        + Add Item
                    </button>

                </div>


                {/* STAT CARDS */}

                <div className="stats-grid">

                    <div className="stat-card dashboard-stat">

                        <div className="stat-top">

                            <span>
                                Total Items
                            </span>

                            <div className="stat-icon">
                                📋
                            </div>

                        </div>

                        <strong>
                            {dashboard.totalItems}
                        </strong>

                        <p>
                            Items you're tracking
                        </p>

                    </div>


                    <div className="stat-card dashboard-stat">

                        <div className="stat-top">

                            <span>
                                Due Soon
                            </span>

                            <div className="stat-icon">
                                🔔
                            </div>

                        </div>

                        <strong>
                            {dashboard.dueSoonItems}
                        </strong>

                        <p>
                            Within the next 30 days
                        </p>

                    </div>


                    <div className="stat-card dashboard-stat">

                        <div className="stat-top">

                            <span>
                                Overdue
                            </span>

                            <div className="stat-icon">
                                ⚠️
                            </div>

                        </div>

                        <strong>
                            {dashboard.overdueItems}
                        </strong>

                        <p>
                            Need your attention
                        </p>

                    </div>


                    <div className="stat-card dashboard-stat">

                        <div className="stat-top">

                            <span>
                                Upcoming
                            </span>

                            <div className="stat-icon">
                                📅
                            </div>

                        </div>

                        <strong>
                            {dashboard.upcomingItems}
                        </strong>

                        <p>
                            More than 30 days away
                        </p>

                    </div>

                </div>


                {/* VALUE */}

                <div className="value-card">

                    <div>

                        <p>
                            Total Tracked Value
                        </p>

                        <h2>
                            ₹{Number(
                                dashboard.totalCost
                            ).toLocaleString("en-IN")}
                        </h2>

                        <span className="value-description">
                            Combined value of your tracked items
                        </span>

                    </div>


                    <div className="value-icon">
                        ₹
                    </div>

                </div>


                {/* ITEMS SECTION */}

                <section className="section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Your Items
                            </h2>

                            <p>
                                Keep an eye on your important dates.
                            </p>

                        </div>


                        <button
                            className="view-all-button"
                            onClick={() =>
                                navigate("/items")
                            }
                        >
                            View all →
                        </button>

                    </div>


                    <div className="items-list">

                        {items.length === 0 ? (

                            <div className="empty-state">

                                <div className="dashboard-empty-icon">
                                    📋
                                </div>

                                <h3>
                                    Nothing tracked yet
                                </h3>

                                <p>
                                    Add your first warranty,
                                    subscription, document or bill.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/items")
                                    }
                                >
                                    Add your first item
                                </button>

                            </div>

                        ) : (

                            items
                                .slice(0, 5)
                                .map(item => {

                                    const status =
                                        getItemStatus(
                                            item.dueDate
                                        );

                                    const days =
                                        getDaysRemaining(
                                            item.dueDate
                                        );

                                    return (

                                        <div
                                            className="item-row"
                                            key={item.id}
                                        >

                                            <div className="dashboard-item-info">

                                                <div className="dashboard-item-icon">
                                                    📌
                                                </div>

                                                <div>

                                                    <h3>
                                                        {item.title}
                                                    </h3>

                                                    <p>
                                                        {item.category}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="dashboard-item-date">

                                                <strong>
                                                    {formatDate(
                                                        item.dueDate
                                                    )}
                                                </strong>

                                                <span>
                                                    {days < 0
                                                        ? `${Math.abs(days)} days overdue`
                                                        : days === 0
                                                            ? "Due today"
                                                            : `${days} days remaining`}
                                                </span>

                                            </div>


                                            <span
                                                className={`item-status ${status.className}`}
                                            >
                                                {status.text}
                                            </span>

                                        </div>

                                    );
                                })

                        )}

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="quick-actions">

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-action-grid">

                        <button
                            onClick={() =>
                                navigate("/items")
                            }
                        >
                            <span>➕</span>

                            <div>
                                <strong>
                                    Add Item
                                </strong>

                                <small>
                                    Track something new
                                </small>
                            </div>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/reminders")
                            }
                        >
                            <span>🔔</span>

                            <div>
                                <strong>
                                    View Reminders
                                </strong>

                                <small>
                                    Check upcoming dates
                                </small>
                            </div>

                        </button>


                        <button
                            onClick={() =>
                                navigate("/history")
                            }
                        >
                            <span>🕒</span>

                            <div>
                                <strong>
                                    View History
                                </strong>

                                <small>
                                    See recent activity
                                </small>
                            </div>

                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;