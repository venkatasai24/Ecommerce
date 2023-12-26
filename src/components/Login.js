import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Navbar from "./Navbar";
import "../css/Login.css";

function Login() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!forgot) {
      try {
        const response = await axios.post(
          "/login",
          JSON.stringify({ user, pwd }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        const accessToken = response?.data?.accessToken;
        setAuth({ user, accessToken });
        setErr("");
        setSuccess(`Hi ${user}! You will be redirected shortly...`);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 4000);
      } catch (err) {
        setSuccess("");
        if (!err?.response) {
          setErr("No Server Response");
        } else if (err.response?.status === 401) {
          setErr("Unauthorized");
        } else {
          setErr("Login Failed");
        }
      }
    } else {
      try {
        await axios.patch("/login", JSON.stringify({ user, pwd }), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setSuccess("Updated successfully!");
        setErr("");
        setForgot(false);
      } catch (err) {
        if (!err?.response) {
          setErr("No Server Response");
        } else {
          setErr(err.response?.data);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          {err && !loading && <div className="error">{err}</div>}
          {success && !loading && <div className="success">{success}</div>}
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            required
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
          />
          <label>{forgot && "New "}Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
          />
          {!forgot && (
            <p onClick={() => setForgot(true)} className="forgot-password">
              Forgot Password?
            </p>
          )}
          <button className={loading ? "loading-button" : ""}>
            {loading ? (
              <div className="loading-spinner loading-spinner-form-login"></div>
            ) : (
              <>{forgot ? "Reset" : "Login"}</>
            )}
          </button>
          {!forgot ? (
            <p>
              Dont have an account? <Link to="/register">Register here</Link>
            </p>
          ) : (
            <p>
              Wait, I remember my password...
              <Link onClick={() => setForgot(false)}>Click here</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
