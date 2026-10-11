import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Reminders() {

    const navigate = useNavigate();

    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadReminders = async () => {

            try {

                const response =
                    await api.get("/reminders");

                setReminders(response.data);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 401) {

                    localStorage.clear();
                    navigate("/login");

                } else {

                    setError(
                        "Unable to load reminders"
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        loadReminders();

    }, [navigate]);


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


    const getDaysText = (days) => {

        if (days === 0) {
            return "Due today";
        }

        if (days === 1) {
            return "Due tomorrow";
        }

        return `${days} days remaining`;
    };


    if (loading) {

        return (
            <div className="loading">
                Loading reminders...
            </div>
        );
    }


    return (

        <div className="reminders-page">

            {/* HEADER */}

            <div className="reminders-header">

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
                        Reminders 🔔
                    </h1>

                    <p>
                        Stay ahead of important deadlines.
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


            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* EMPTY */}

            {!error && reminders.length === 0 && (

                <div className="reminders-empty">

                    <div className="empty-icon">
                        🔔
                    </div>

                    <h2>
                        No upcoming reminders
                    </h2>

                    <p>
                        You're all caught up!
                        Items with reminders will
                        appear here.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/items")
                        }
                    >
                        Manage Items
                    </button>

                </div>

            )}


            {/* REMINDERS */}

            {reminders.length > 0 && (

                <div className="reminders-list">

                    {reminders.map(reminder => (

                        <div
                            className="reminder-card"
                            key={reminder.id}
                        >

                            <div className="reminder-icon">
                                🔔
                            </div>


                            <div className="reminder-content">

                                <div className="reminder-title-row">

                                    <div>

                                        <span className="category-badge">
                                            {reminder.category}
                                        </span>

                                        <h2>
                                            {reminder.title}
                                        </h2>

                                    </div>

                                    <span
                                        className={
                                            reminder.daysRemaining <= 7
                                                ? "urgent-badge"
                                                : "normal-badge"
                                        }
                                    >
                                        {getDaysText(
                                            reminder.daysRemaining
                                        )}
                                    </span>

                                </div>


                                <div className="reminder-details">

                                    <div>

                                        <span>
                                            Due date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                reminder.dueDate
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Reminder date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                reminder.reminderDate
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Reminders;