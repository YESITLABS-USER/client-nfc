import React, { useEffect, useState } from "react";
import logo from "/images/login-page/logo.svg"
import email_svg from "/images/login-page/icons/email.svg"
import password_svg from "/images/login-page/icons/password.svg"
import success_svg from "/images/login-page/login-succ.svg"
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import CryptoJS from "crypto-js";
import {login} from "../redux/slices/adminSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, admin } = useSelector((state) => state.admin)

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("nfc-admin");
      if (storedAdmin || admin) {
        setShowModal(true);
      }
    }
  }, [admin]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return value;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password }));
      if (admin) {
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setLoginError(err?.message || "Login failed. Please try again.");
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, "secretKey").toString();
    if (keepLoggedIn) {
      setCookie("email", email, 7);
      setCookie("password", encryptedPassword, 7);
    }
  };

  useEffect(() => {
    const savedEmail = getCookie("email");
    const encryptedPassword = getCookie("password");

    if (savedEmail && encryptedPassword) {
      try {
        const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, "secretKey").toString(CryptoJS.enc.Utf8);
        setEmail(savedEmail);
        setPassword(decryptedPassword);
        setKeepLoggedIn(true);
      } catch (error) {
        console.error("Error decrypting password:", error);
      }
    }
  }, []);



  return (
    <div className="login-wrap">
      <div className="login-in">
        <div className="login-logo">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h1>Welcome to Tagis</h1>
        </div>
        <div className="login-form">
          <form className="animate__animated animate__bounceIn" onSubmit={handleSubmit}>
            <h1>Admin Login</h1>
            <hr />
            <label className="login-lbl">
              <img src={email_svg} alt="Email Icon" />
              <input
                type="email"
                name="email"
                className="login-txt"
                value={email}
                onChange={(e) => {setLoginError(''); setEmail(e.target.value)}}
                placeholder="Enter your Email here"
                required
              />
            </label>
            <label className="login-lbl mb-0">
              <img src={password_svg} alt="Password Icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                className="login-txt"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {setLoginError(''); setPassword(e.target.value)}}
                placeholder="Enter your Password"
                required
              />
              <div className="password-eye" onClick={togglePasswordVisibility}>
                <i className={passwordVisible ? "fas fa-eye" : "fas fa-eye-slash"} id="eye"></i>
              </div>
            </label>
            <div className="rembr-me" >
              <input type="checkbox" name="rembr-me" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)}/> Keep me logged in
            </div>
            {loginError && <p style={{color:'red', fontSize:'14px'}}> {loginError} </p>}
            <input type="submit" className="login-btn" value={loading ? "Loading..." : "Login"} />
          </form>
        </div>
      </div>

      <LoginSuccessModal showModal={showModal} setShowModal={setShowModal} navigate={navigate}/>
    </div>
  );
};

export default Login;

const LoginSuccessModal = ({ showModal, setShowModal, navigate }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      centered
      className="login-succ animate__animated animate__bounceIn login-modal-wp"
    >
      <Modal.Body>
        <div className="logout-in">
          <h1>Login Successful</h1>
          <img src={success_svg} alt="Success" />
          <p>Welcome to Tagis Admin panel!</p>
          <form>
            <Button
              onClick={() => {
                setShowModal(false);
                navigate('/client-management');
              }}
              className="logout-in-btn"
            >
              Okay
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
