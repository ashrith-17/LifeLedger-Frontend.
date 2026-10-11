import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Reminders from "./pages/Reminders";
import History from "./pages/History";

function App() {

    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? <Navigate to="/dashboard" />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                

                <Route
                    path="/dashboard"
                    element={
                        token
                            ? <Dashboard />
                            : <Navigate to="/login" />
                    }
                />
                <Route
                    path="/items"
                   element={
                  token
                  ? <Items />
                : <Navigate to="/login" />
                }
                />
                <Route
                     path="/reminders"
                  element={
                  token
                  ? <Reminders />
                  : <Navigate to="/login" />
                }
                />
                <Route
    path="/history"
    element={
        token
            ? <History />
            : <Navigate to="/login" />
    }
/>
                

            </Routes>

        </BrowserRouter>
    );
}

export default App;