import React, { useState } from "react";
import { loginUser } from "../services/api.ts";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");  // Add successMessage state
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await loginUser(username, password);
            localStorage.setItem("token", response.data.token);
            setSuccessMessage("Login successful! Redirecting to dashboard..."); // Set success message
            setError("");  // Clear any existing error messages
            setTimeout(() => {
                navigate("/dashboard");  // Redirect after a brief delay
            }, 2000);  // 2 seconds delay for user to see the success message
        } catch (err) {
            setError("Invalid credentials");
            setSuccessMessage("");  // Clear success message in case of error
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}  {/* Error message styling */}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}  {/* Success message styling */}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
