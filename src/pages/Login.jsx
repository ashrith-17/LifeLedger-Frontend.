import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setMessage("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                form
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email
                })
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-container">

            <div className="auth-card">

                <div className="auth-logo">
                    LifeLedger
                </div>

                <p className="auth-subtitle">
                    Keep track of what matters.
                </p>


                <div className="auth-heading">

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to continue to your account.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div>

                        <label>
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {message && (

                        <div className="auth-error">
                            {message}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>


                <div className="auth-link">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create one
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;