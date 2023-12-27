/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import "../css/Profile.css";
import Navbar from "./Navbar";

function Profile() {
  const [user, setUser] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [edit, setEdit] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosPrivate.get("/user/cart", {
          withCredentials: true,
        });
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [axiosPrivate]);

  useEffect(() => {
    setCartLength(cartItems.length);
  }, [cartItems]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    // let isMounted = true;
    // const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(
          "/user",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
          // {
          //   signal: controller.signal,
          // }
        );
        // isMounted && setUser({ ...response.data });
        setUser({ ...response.data });
        setPhoneNumber(response.data.phoneNumber);
        setAddress(response.data.address);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getUsers();

    // return () => {
    //   isMounted = false;
    //   controller.abort();
    // };
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!isValidPhoneNumber(phoneNumber)) {
      // Handle invalid phone number (you can set an error state, display a message, etc.)
      setErr("Invalid Phone Number");
      return;
    }
    if (!address) {
      setErr("Fill address!!");
      return;
    }
    const payLoad = {
      username: user.username,
      ...(phoneNumber !== user.phoneNumber && { phoneNumber }),
      ...(address !== user.address && { address }),
    };

    if (!payLoad.phoneNumber && !payLoad.address) {
      setErr("No changes made...");
      return;
    }
    try {
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify(payLoad),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUser({ ...response.data });
      setPhoneNumber(response.data.phoneNumber);
      setAddress(response.data.address);
      setErr("");
      setEdit(false);
      setSuccess("Updated successfully!!");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setSuccess("");
      if (!err?.response) {
        setErr("No Server Response");
      } else {
        setErr(err.response?.data);
      }
    }
  };

  // Function to calculate delivery date (ordered date + 5 days)
  const calculateDeliveryDate = (orderedDate) => {
    const deliveryDate = new Date(orderedDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate;
  };

  // Function to check if the delivery date is today or in the past
  const isDelivered = (deliveryDate) => {
    const today = new Date();
    return deliveryDate <= today;
  };

  return (
    <>
      <Navbar
        toggleCart={toggleCart}
        cartLength={cartLength}
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setCartLength={setCartLength}
      />
      {user && user?.username ? (
        <>
          <div className="profile">
            <div className="profile-details">
              <form onSubmit={handleProfileSubmit}>
                {err && <div className="error">{err}</div>}
                {success && <div className="success">{success}</div>}
                <h2>Hello, {user.username}</h2>
                <label>Phone Number</label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="IN"
                  readOnly={!edit}
                />
                <label>Address</label>
                <textarea
                  readOnly={!edit}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                />
                <FontAwesomeIcon
                  title={edit ? "Reset" : "Edit"}
                  className="profile-icon"
                  style={edit && { opacity: "0.5" }}
                  icon={faEdit}
                  onClick={() => setEdit(!edit)}
                />
                <button style={{ visibility: !edit && "hidden" }}>
                  Update
                </button>
              </form>
            </div>
            <div className="order-details">
              <h2>Your Orders</h2>
              {user.orders && user.orders.length ? (
                <div className="user-orders">
                  {user.orders
                    .slice()
                    .reverse()
                    .map((order) => (
                      <a
                        href={`/orders/${order._id}`}
                        className="order-link"
                        data-aos="flip-right"
                      >
                        <div key={order._id} className="cart-item order-item">
                          <p className="cart-item-title">
                            OrderId :{order._id}
                          </p>
                          {order.orderedOn && (
                            <>
                              <p className="cart-item-title">
                                Ordered on{" "}
                                {new Date(order.orderedOn).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata", // Use the timezone you need
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                  }
                                )}
                              </p>
                              <p className="cart-item-title">
                                Delivery on or before{" "}
                                {calculateDeliveryDate(
                                  new Date(order.orderedOn)
                                ).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="cart-item-title">
                                {isDelivered(
                                  calculateDeliveryDate(
                                    new Date(order.orderedOn)
                                  )
                                ) ? (
                                  <>
                                    Status: <b>Delivered</b>
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </a>
                    ))}
                </div>
              ) : (
                <p>No orders made yet!!</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
}

export default Profile;
