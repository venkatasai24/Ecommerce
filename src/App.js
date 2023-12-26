import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import Profile from "./components/Profile";
import PersistLogin from "./components/persistLogin";
import Search from "./components/search";
import Checkout from "./components/Checkout";
import Success from "./components/success";
import Order from "./components/Order";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route index element={<HomePage />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="/orders/:id" element={<Order />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Route>
        </Route>
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
