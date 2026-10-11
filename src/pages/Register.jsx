import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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

            await api.post(
                "/auth/register",
                form
            );

            setMessage(
                "Registration successful!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
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
                    Organize the important things in life.
                </p>


                <div className="auth-heading">

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Start managing your important dates.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div>

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


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
                                placeholder="Minimum 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                minLength="6"
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

                        <div
                            className={
                                message.includes(
                                    "successful"
                                )
                                    ? "auth-success"
                                    : "auth-error"
                            }
                        >
                            {message}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>


                <div className="auth-link">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Sign in
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;