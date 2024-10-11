import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../OtherComponents/LoadingSpinner";

const ClientSignup = ({ onLogin }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [clientUsername, setClientUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/clientSignup`,
        { clientId, clientUsername, password },
        { withCredentials: true }
      );

      const { user } = response.data;
      onLogin(user); // Update user state in App component
      navigate("/dashboard"); // Redirect user to the specified URL
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 400) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("Network error. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        setError("An error occurred. Please try again.");
      }
      console.error("Error config:", error.config);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingSpinner isLoading={loading} />
      <h2>Client Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={submit} disabled={loading}>
        <label htmlFor="clientId">
          Client Id:
          <input
            type="text"
            name="clientId"
            id="clientId"
            required
            autoFocus
            value={clientId}
            autoComplete="off"
            placeholder="Input your Client Id"
            onChange={(e) => setClientId(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="clientUsername">
          Client Username:
          <input
            type="text"
            name="clientUsername"
            id="clientUsername"
            required
            autoFocus
            value={clientUsername}
            autoComplete="off"
            placeholder="Input your Client Username"
            onChange={(e) => setClientUsername(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            autoComplete="off"
            placeholder="Input your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default ClientSignup;
