/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../css/Checkout.css";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import Navbar from "./Navbar";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [err, setErr] = useState("");
  const [payment, setPayment] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const paymentLink = localStorage.getItem("paymentLink");

    if (paymentLink && cartLength) {
      setErr("Order not successful");

      localStorage.removeItem("paymentLink");

      const timeoutId = setTimeout(() => {
        setErr("");
      }, 3000);

      return () => {
        // Clear the timeout if the component is unmounted before it completes
        clearTimeout(timeoutId);
      };
    }
  }, [cartLength]);

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

  const calculateTotalPrice = () => {
    return cartItems
      ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;
  };

  const handleCheckout = async () => {
    setPayment(true);
    try {
      const response = await axiosPrivate.post(
        "/stripe/create-checkout-session",
        {
          cartItems: cartItems,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      localStorage.setItem("paymentLink", JSON.stringify(response.data.url));
      setTimeout(() => {
        window.location.href = response.data.url;
      }, 5000);
    } catch (err) {
      console.log(err);
    }
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
      <button
        title="Back"
        className="go-back-button missing"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon color="steelblue" icon={faArrowLeft} />
      </button>
      {!payment ? (
        <h2 className="checkout">Checkout</h2>
      ) : (
        <div className="error-container">
          <div className="error" style={{ maxWidth: "300px" }}>
            <b>
              Demo Payment GateWay
              <br />
              (For Testing Only)
            </b>
            <br />
            Card: 4242 4242 4242 4242
            <br />
            Exp Date: Any future date
            <br />
            Security Code: Any three numbers
            <br />
            <b>Note</b>: Checkout optimized for U.S. transactions. No country
            selection required.
          </div>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-summary">
          {cartItems && cartItems.length > 0 ? (
            <>
              {err && <div className="error">{err}</div>}
              <div className="checkout-cart-items-card">
                {cartItems.map((item) => (
                  <div className="cart-item cart-item-checkout" key={item.id}>
                    <div className="cart-item-details checkout-items">
                      <p className="cart-item-title">{item.title}</p>
                      <p className="cart-item-price">
                        ₹{item.price} &times; {item.quantity}
                      </p>
                      <p className="cart-item-price">
                        SubTotal : ₹{item.price * item.quantity}
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
              <h3>Total: ₹{calculateTotalPrice()}</h3>
              <div className="checkout-payment">
                {!payment && (
                  <button onClick={handleCheckout}>Proceed to Pay</button>
                )}
              </div>
            </>
          ) : (
            <h3>No orders made</h3>
          )}
        </div>
      </div>
    </>
  );
}

export default Checkout;
