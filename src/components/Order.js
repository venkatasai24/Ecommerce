/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import "../css/Checkout.css";
import Navbar from "./Navbar";

function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosPrivate.get("/user/cart", {
          withCredentials: true,
        });
        setCartItems(response.data?.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [axiosPrivate]);

  useEffect(() => {
    setCartLength(cartItems.length);
  }, [cartItems]);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axiosPrivate.get(
          `/user/order?_id=${id}`, // Pass _id as a query parameter
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setOrder(response.data);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 404) {
          navigate("/error");
        }
      }
    };
    getOrder();

    return () => {
      console.log("useffect unmounted");
    };
  }, [axiosPrivate, id, navigate]);

  const calculateTotalPrice = () => {
    return order && order.orderedItems && order.orderedItems.length > 0
      ? order.orderedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      : 0;
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
    <div>
      <Navbar
        toggleCart={toggleCart}
        cartLength={cartLength}
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setCartLength={setCartLength}
      />
      <button
        title="Back"
        className="go-back-button missing"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon color="steelblue" icon={faArrowLeft} />
      </button>
      <h2 className="checkout">OrderId: {id}</h2>
      <div className="checkout-container">
        <div className="checkout-summary">
          <div className="checkout-cart-items-card">
            {order &&
              order.orderedItems &&
              order.orderedItems.length > 0 &&
              order.orderedItems.map((item) => (
                <div className="cart-item cart-item-checkout" key={item.id}>
                  <div className="cart-item-details checkout-items">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-price">
                      ₹ {item.price} &times; {item.quantity}
                    </p>
                    <p className="cart-item-price">
                      SubTotal : ₹ {item.price * item.quantity}
                    </p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image checkout-image"
                    onClick={() => navigate(`/product/${item.id}`)}
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
          <h3>Total: ₹ {calculateTotalPrice()}</h3>
          {order.orderedOn && (
            <>
              <div className="checkout-items">
                <p className="cart-item-title">
                  Ordered on{" "}
                  {new Date(order.orderedOn).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata", // Use the timezone you need
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
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
                    calculateDeliveryDate(new Date(order.orderedOn))
                  ) ? (
                    <>
                      Status: <b>Delivered</b>
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
