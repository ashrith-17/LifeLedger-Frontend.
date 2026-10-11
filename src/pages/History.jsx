import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function History() {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response =
                    await api.get("/history");

                setHistory(response.data);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 401) {

                    localStorage.clear();
                    navigate("/login");

                } else {

                    setError(
                        "Unable to load history"
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        loadHistory();

    }, [navigate]);


    const formatDate = (timestamp) => {

        return new Date(timestamp).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const formatTime = (timestamp) => {

        return new Date(timestamp).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    const getActionText = (action) => {

        switch (action) {

            case "CREATED":
                return "Item created";

            case "UPDATED":
                return "Item updated";

            case "DELETED":
                return "Item deleted";

            default:
                return action;
        }
    };


    const getActionClass = (action) => {

        switch (action) {

            case "CREATED":
                return "history-created";

            case "UPDATED":
                return "history-updated";

            case "DELETED":
                return "history-deleted";

            default:
                return "history-default";
        }
    };


    if (loading) {

        return (
            <div className="loading">
                Loading history...
            </div>
        );
    }


    return (

        <div className="history-page">

            {/* HEADER */}

            <div className="history-header">

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
                        History 🕒
                    </h1>

                    <p>
                        See everything you've changed in LifeLedger.
                    </p>

                </div>

                <button
                    className="add-button"
                    onClick={() =>
                        navigate("/items")
                    }
                >
                    + Manage Items
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* EMPTY STATE */}

            {!error && history.length === 0 && (

                <div className="history-empty">

                    <div className="empty-icon">
                        🕒
                    </div>

                    <h2>
                        No history yet
                    </h2>

                    <p>
                        Your item activity will appear here
                        when you create, update or delete items.
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


            {/* HISTORY */}

            {history.length > 0 && (

                <div className="history-list">

                    {history.map((entry) => (

                        <div
                            className="history-card"
                            key={entry.id}
                        >

                            <div
                                className={`history-icon ${getActionClass(
                                    entry.action
                                )}`}
                            >
                                {entry.action === "CREATED" && "＋"}

                                {entry.action === "UPDATED" && "✎"}

                                {entry.action === "DELETED" && "×"}

                                {![
                                    "CREATED",
                                    "UPDATED",
                                    "DELETED"
                                ].includes(entry.action) && "•"}
                            </div>


                            <div className="history-content">

                                <div className="history-main">

                                    <div>

                                        <span className="category-badge">
                                            {entry.category}
                                        </span>

                                        <h2>
                                            {entry.title}
                                        </h2>

                                        <p>
                                            {getActionText(
                                                entry.action
                                            )}
                                        </p>

                                    </div>

                                    <div className="history-date">

                                        <strong>
                                            {formatDate(
                                                entry.timestamp
                                            )}
                                        </strong>

                                        <span>
                                            {formatTime(
                                                entry.timestamp
                                            )}
                                        </span>

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

export default History;