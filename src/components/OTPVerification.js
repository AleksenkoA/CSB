import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp, selectAuth } from "../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import "../styles/Login.css";

const OTPVerification = ({ sessionId, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(selectAuth);

  const [otp, setOtp] = useState("");

  // Redirect to dashboard after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(verifyOtp({ otp, sessionId }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{t("login.verifyOtp")}</h2>
        {error && (
          <div className="error-message">
            {error.message || "OTP verification failed. Please try again."}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("login.otp")}</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isLoading}
              placeholder=""
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? t("common.loading") : t("login.submit")}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="back-button"
            disabled={isLoading}
          >
            {t("login.backToLogin")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
