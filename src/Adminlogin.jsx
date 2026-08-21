import { useState } from "react";
import { setAdminAuth } from "./Auth";

export function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = btoa(`${username}:${password}`);

    try {
      // Hit any protected admin endpoint to verify the credentials.
      // GET /admin is the enquiries list, guarded by hasRole("ADMIN").
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin`, {
        headers: { Authorization: `Basic ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setError("Invalid username or password.");
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Try again.");
        return;
      }

      setAdminAuth(token);
      onSuccess();
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}