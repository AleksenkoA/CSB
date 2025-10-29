import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { hasScope, SCOPES } from "../../utils/scopes";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/config";
import searchIcon from "../../assets/icons/search.svg";
import notificationsIcon from "../../assets/icons/notifications.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import userIcon from "../../assets/icons/main_user.svg";
import logoIcon from "../../assets/icons/logo.svg";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import logoEllipseIcon from "../../assets/icons/logo_ellipse.svg";
import "../../styles/Header.css";

const Header = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { scopes } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  }, [currentLanguage]);

  const navItems = [
    {
      key: "dashboard",
      label: t("nav.dashboard"),
      requiredScope: SCOPES.VIEW_DASHBOARD,
    },
    {
      key: "cardManagement",
      label: t("nav.cardManagement"),
      requiredScope: SCOPES.VIEW_CARDS,
    },
    {
      key: "promoCodes",
      label: t("nav.promoCodes"),
      requiredScope: SCOPES.VIEW_PROMOS,
    },
    {
      key: "userManagement",
      label: t("nav.userManagement"),
      requiredScope: SCOPES.VIEW_USERS,
    },
    {
      key: "accountWallets",
      label: t("nav.accountWallets"),
      requiredScope: SCOPES.VIEW_WALLETS,
    },
  ];

  return (
    <header className="dashboard-header">
      <div className="header-main">
        <div className="header-left">
          <img
            src={logoEllipseIcon}
            alt="Logo Ellipse"
            className="logo-ellipse-icon"
          />
          <img src={logoIcon} alt="Logo" className="logo-icon" />
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav
            className={`header-nav ${isMobileMenuOpen ? "mobile-open" : ""}`}
          >
            {navItems.map(
              (item) =>
                (!item.requiredScope ||
                  hasScope(scopes, item.requiredScope)) && (
                  <button
                    key={item.key}
                    className={`nav-button ${
                      activeTab === item.key ? "active" : ""
                    }`}
                    onClick={() => {
                      onTabChange(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {activeTab === item.key && item.key === "dashboard" && (
                      <img
                        src={dashboardIcon}
                        alt="Dashboard"
                        className="nav-icon"
                      />
                    )}
                    <span style={{ display: "block" }}>{item.label}</span>
                  </button>
                )
            )}
          </nav>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <img src={searchIcon} alt="Search" className="search-icon" />
          </div>
          <div className="header-icons">
            <div className="language-switcher">
              <button
                className={`lang-button ${
                  currentLanguage === "en" ? "active" : ""
                }`}
                onClick={() => changeLanguage("en")}
                title="English"
              >
                EN
              </button>
              <button
                className={`lang-button ${
                  currentLanguage === "ru" ? "active" : ""
                }`}
                onClick={() => changeLanguage("ru")}
                title="Русский"
              >
                RU
              </button>
            </div>
            <button className="icon-button notifications">
              <img src={notificationsIcon} alt="Notifications" />
            </button>
            <button className="icon-button">
              <img src={settingsIcon} alt="Settings" />
            </button>
            <button className="icon-button profile">
              <img src={userIcon} alt="User" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
