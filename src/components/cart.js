import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import "../css/Cart.css";

function Cart({ isCartOpen, cartItems, toggleCart, setCartItems }) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const cartStyles = {
    transform: `translateX(${isCartOpen ? "0" : "100%"})`,
  };

  const handleIncrementQuantity = (itemId) => {
    const cart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(cart);
    const setCartItemsBackend = async () => {
      try {
        await axiosPrivate.patch(
          "/user/cart",
          {
            cartItems: cart,
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error updating cart items:", error);
      }
    };

    setCartItemsBackend();
  };

  const handleDecrementQuantity = (itemId) => {
    const cart = cartItems.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(cart);
    const setCartItemsBackend = async () => {
      try {
        await axiosPrivate.patch(
          "/user/cart",
          {
            cartItems: cart,
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error updating cart items:", error);
      }
    };

    setCartItemsBackend();
  };

  const handleRemoveItem = (itemId) => {
    // Filter out the item with the specified itemId
    const cart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(cart);
    const setCartItemsBackend = async () => {
      try {
        await axiosPrivate.patch(
          "/user/cart",
          {
            cartItems: cart,
          },
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error updating cart items:", error);
      }
    };

    setCartItemsBackend();
  };

  const calculateTotalPrice = () => {
    return cartItems
      ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;
  };

  return (
    <>
      {isCartOpen && (
        <div className="cart-sidebar" style={cartStyles}>
          <FontAwesomeIcon
            icon={faTimes}
            className="cart-close-icon"
            onClick={toggleCart}
          />
          <h3>Your Cart</h3>
          {cartItems &&
            cartItems.length > 0 &&
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className="remove-item-icon"
                  onClick={() => handleRemoveItem(item.id)}
                />
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <div className="cart-item-details">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">₹ {item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleDecrementQuantity(item.id)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrementQuantity(item.id)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          <div className="cart-total">
            {cartItems && cartItems.length ? (
              <>
                <p>Total</p>
                <p>₹ {calculateTotalPrice().toFixed(2)}</p>
                <p
                  className="payment-link"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </p>
              </>
            ) : (
              <p>Cart is empty :(</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
