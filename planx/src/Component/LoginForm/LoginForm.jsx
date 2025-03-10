import React, { useState } from 'react';
import { FaUser, FaLock, FaKey } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const validateEmail = (email) => {
    if (email.length < 5) {
      return "Email phải có ít nhất 5 ký tự";
    } else if (!email.includes('@')) {
      return "Email phải chứa '@'";
    } 
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (!emailErr && !passwordErr) {
      try {
        const response = await fetch("http://localhost:8080/account/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          throw new Error("Đăng nhập thất bại!");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); // Lưu token vào localStorage
        setIsLoggedIn(true);
        alert("Đăng nhập thành công!");
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi đăng nhập: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Bạn đã đăng xuất!");
  };

  return (
    <div className="body">
      <div className="wrapper">
        {isLoggedIn ? (
          <div>
            <h1>Welcome!</h1>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>Account Management</h1>
            <div className="input-box">
              <input
                type="text"
                className="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <FaUser className="icon" />
            </div>
            {emailError && <p className="error">{emailError}</p>}
            <div className="input-box">
              <input
                type="password"
                className="text"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <FaLock className="icon" />
            </div>
            {passwordError && <p className="error">{passwordError}</p>}

            <div className="sign-key">
              <FaKey className="icon-key" />
              <a href="#">Sign in with passkey</a>
            </div>

            <div className="remember-forgot">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
