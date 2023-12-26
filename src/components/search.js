/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsonData from "../assets/data.json";
import ProductCard from "./ProductCard";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import Navbar from "./Navbar";

function Search() {
  const { query } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

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

  const data = jsonData.products;

  const filteredProducts = data.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Navbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        toggleCart={toggleCart}
        cartLength={cartLength}
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
        setCartLength={setCartLength}
      />
      <button
        title="Back to Home"
        className="go-back-button"
        onClick={() => navigate("/")}
      ></button>
      <div className="products">
        {filteredProducts.length ? (
          <h2>
            Found {filteredProducts.length} items with keyword {query}
          </h2>
        ) : (
          <h2>No product found!</h2>
        )}
        <div className="products-list">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Search;
