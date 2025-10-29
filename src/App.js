import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./components/Login";
import OTPVerification from "./components/OTPVerification";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./i18n/config";

function App() {
  const [showOtp, setShowOtp] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const handleLoginSuccess = (session) => {
    setSessionId(session);
    setShowOtp(true);
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
    setSessionId(null);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                !showOtp ? (
                  <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <OTPVerification
                    sessionId={sessionId}
                    onBack={handleBackToLogin}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
