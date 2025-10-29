import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, selectAuth } from "../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";
import "../styles/Login.css";

const Login = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, scopes } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("i18nextLng") || i18n.language || "en";
    if (savedLanguage !== currentLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  // Redirect to dashboard after successful authentication
  useEffect(() => {
    if (isAuthenticated && scopes.length > 0) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, scopes, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear();

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      if (result.payload.access_token) {
        navigate("/dashboard");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-language-switcher">
        <button
          className={`lang-button ${currentLanguage === "en" ? "active" : ""}`}
          onClick={() => changeLanguage("en")}
          title="English"
        >
          EN
        </button>
        <button
          className={`lang-button ${currentLanguage === "ru" ? "active" : ""}`}
          onClick={() => changeLanguage("ru")}
          title="Русский"
        >
          RU
        </button>
      </div>
      <div className="login-card">
        <h2>{t("login.title")}</h2>
        {error && (
          <div className="error-message">
            {error.message || "Login failed. Please check your credentials."}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("login.email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>{t("login.password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>{t("login.otp")}</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder=""
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? t("common.loading") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
