/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "../css/Product.css";
import useAuth from "../hooks/useAuth";
import jsonData from "../assets/data.json";
import ProductCard from "./ProductCard";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import Navbar from "./Navbar";

function Product() {
  const { auth } = useAuth();
  const { id } = useParams();
  const [data, setData] = useState(jsonData.products);
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [recommendedData, setRecommendedData] = useState();
  const axiosPrivate = useAxiosPrivate();

  if (id < 1 || id > 100) navigate("/error");

  const handleSwalAndApiCall = async (item) => {
    await Swal.fire({
      title: `${item} Added to Cart`,
      text: `Continue shopping or proceed to checkout.`,
      icon: "info",
      confirmButtonColor: "steelblue",
      confirmButtonText: "OK",
    });
  };

  useEffect(() => {
    setCartLength(cartItems.length);
  }, [cartItems]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

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
    setLoading(true);

    const filteredData = jsonData.products.filter(
      (item) => item.id === Number(id)
    );

    if (filteredData.length > 0) {
      setData(filteredData[0]);

      const category = filteredData[0].category;

      setRecommendedData(
        jsonData.products.filter(
          (item) => item.category === category && item.id !== id
        )
      );
    }

    setLoading(false);
  }, [id, auth]);

  const addToCart = async () => {
    setLoading(true);
    const newItem = data;

    let cart = cartItems;

    // Check if the item already exists in cartItems
    const existingItemIndex =
      cart && cart.length
        ? cart.findIndex((item) => item.id === newItem.id)
        : -1;

    if (existingItemIndex !== -1) {
      // If item exists, update its quantity
      cart[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add it to cartItems
      cart.push({
        id: newItem.id,
        title: newItem.title,
        price: newItem.price,
        quantity: 1,
        image: newItem.thumbnail,
      });
    }

    setCartItems(cart);

    setCartLength(cart.length);

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

    setLoading(false);

    handleSwalAndApiCall(newItem.title);
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
      <div className="product-container">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <button
              title="Back to Home"
              className="go-back-button"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon color="steelblue" icon={faArrowLeft} />
            </button>
            <div className="product-image">
              <img src={data?.thumbnail} alt={data.title} />
            </div>
            <div className="product-details">
              {data.stock < 50 && (
                <div className="error" style={{ width: "fit-content" }}>
                  Hurry Up! few items left...
                </div>
              )}
              <h1>{data.title}</h1>
              <p>{data.description}</p>
              <p>
                <strong>₹ {data.price}</strong>
              </p>
              <p>
                <strong>
                  <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />{" "}
                  {data.rating}{" "}
                </strong>
              </p>
              <p>
                <strong>{data.stock}</strong> items in stock
              </p>
              <button className="cart-button" onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          </>
        )}
      </div>
      <div className="recommended-products">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <h2>Recommended</h2>
            <div className="products-list">
              {recommendedData &&
                [...recommendedData]
                  .sort(() => Math.random() - 0.5)
                  .map(
                    (product) =>
                      product.id !== Number(id) && (
                        <ProductCard key={product.id} product={product} />
                      )
                  )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Product;
