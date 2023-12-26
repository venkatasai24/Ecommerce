/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./cart";
import useLogout from "../hooks/useLogout";

function Navbar({
  searchInput,
  setSearchInput,
  toggleCart,
  cartLength,
  isCartOpen,
  cartItems,
  setCartItems,
  setCartLength,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        V<span style={{ verticalAlign: "super" }}>S</span>
      </div>
      <div className="links">
        {setSearchInput && (
          <div className="search">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/search/${searchInput}`);
              }}
            >
              <input
                type="text"
                placeholder="Search Product"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
            </form>
          </div>
        )}
        <div className="three">
          {!(
            location.pathname === "/login" || location.pathname === "/register"
          ) && (
            <>
              <a title="View Profile" href="/profile">
                <FontAwesomeIcon icon={faUser} />
              </a>
              <a role="button" title="LogOut" onClick={signOut}>
                <FontAwesomeIcon icon={faSignOut} />
              </a>
            </>
          )}
          {toggleCart && (
            <div
              className="cart-container"
              title="view cart"
              onClick={toggleCart}
            >
              {cartLength > 0 && (
                <span className="cart-count">{cartLength}</span>
              )}
              <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
            </div>
          )}
        </div>
      </div>
      {isCartOpen && setCartItems && toggleCart && setCartLength && (
        <Cart
          isCartOpen={isCartOpen}
          cartItems={cartItems}
          setCartItems={setCartItems}
          toggleCart={toggleCart}
          setCartLength={setCartLength}
        />
      )}
    </div>
  );
}

export default Navbar;
