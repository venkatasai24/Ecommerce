import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from "../api/axios";
import "../css/Login.css";
import Navbar from "./Navbar";

function Register() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!isValidPhoneNumber(phoneNumber)) {
      // Handle invalid phone number (you can set an error state, display a message, etc.)
      setErr("Invalid Phone Number");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        "/register",
        JSON.stringify({ user, pwd, phoneNumber, address }), // Include phone number and address in the request body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setErr("");
      setSuccess("User created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setSuccess("");
      if (!err?.response) {
        setErr("No Server Response");
      } else if (err.response?.status === 409) {
        setErr("Username Taken");
      } else {
        setErr("Registration Failed");
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
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
          />
          <label>Phone Number</label> {/* Add phone number input */}
          <PhoneInput
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={setPhoneNumber}
            defaultCountry="IN"
            required
          />
          <label>Address</label> {/* Add address input */}
          <textarea
            placeholder="Enter your address"
            required
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
          <button
            className={loading ? "loading-button" : ""}
            // style={loading ? { transform: "translateY(5px)" } : {}}
          >
            {loading ? (
              <div className="loading-spinner loading-spinner-form-login"></div>
            ) : (
              "Register"
            )}
          </button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
