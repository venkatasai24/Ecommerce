/* eslint-disable jsx-a11y/anchor-is-valid */
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Marquee from "react-fast-marquee";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookSquare,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import FilterModal from "./FilterModel";
import jsonData from "../assets/data.json";
import ProductCard from "./ProductCard";
import useAxiosPrivate from "../hooks/useAxiosprivate";
import Navbar from "./Navbar";
import "../css/HomePage.css";
// import mainImage from "../assets/homePage.jpg";

library.add(faFacebookSquare, faInstagram, faYoutube);

function HomePage() {
  const [data, setData] = useState(jsonData.products);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLength, setCartLength] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 175000]);
  const axiosPrivate = useAxiosPrivate();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    setLoading(true);
    // Randomize the order of the data array
    const randomizedData = [...jsonData.products].sort(
      () => Math.random() - 0.5
    );
    setData(randomizedData);
    setLoading(false);
  }, []);

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

  const handleApplyFilters = () => {
    // Apply filters based on selectedCategories and priceRange
    let filteredData = jsonData.products;

    if (selectedCategories.length > 0) {
      filteredData = filteredData.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    filteredData = filteredData.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setData(filteredData);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="homepage">
      <div className="marquee">
        <Marquee direction="right">Festive Sale 50% OFF</Marquee>
      </div>
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
      {/* <div className="image-div">
        <img className="main-image" src={mainImage} alt="mainImage" />
      </div> */}
      <div className="products">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="filter-h2">
              <h2>Products</h2>
              <button
                title="Filters"
                className="filter-button"
                onClick={() => {
                  setIsFilterModalOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
              {isFilterModalOpen && (
                <FilterModal
                  onClose={() => {
                    setIsFilterModalOpen(false);
                  }}
                  onApply={handleApplyFilters}
                  setSelectedCategories={setSelectedCategories}
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              )}
            </div>
            <div className="products-list">
              {data.length === 0 ? (
                <h2>No product found!</h2>
              ) : (
                data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </>
        )}
      </div>
      <div className="footer">
        <div className="footer-content">
          <h3>About</h3>
          <span>Contact Us</span>
          <span>Terms Of Use</span>
          <span>Terms Of Sale</span>
        </div>
        <div className="footer-content">
          <h3>Help & Support</h3>
          <span>Terms & Conditions</span>
          <span>Shipping</span>
          <span>Returns & Refund Policy</span>
        </div>
        <div className="footer-content">
          <h3>Find Us on</h3>
          <span>
            <FontAwesomeIcon
              icon={faFacebookSquare}
              style={{ color: "#3b5998" }}
              className="search-icon-1"
            />{" "}
            Facebook
          </span>
          <span>
            <FontAwesomeIcon
              icon={faInstagram}
              style={{ color: "#bc2a8d" }}
              className="search-icon-1"
            />{" "}
            Instagram
          </span>
          <span>
            <FontAwesomeIcon
              icon={faYoutube}
              style={{ color: "#ff0000" }}
              className="search-icon-1"
            />{" "}
            Youtube
          </span>
        </div>
        <div className="author">
          Designed by <a href="https://github.com/venkatasai24">Venkata Sai</a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
