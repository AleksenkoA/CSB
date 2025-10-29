import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectScopes } from "../store/slices/authSlice";
import { hasScope } from "../utils/scopes";
import "../styles/AccessWrapper.css";

const AccessWrapper = ({
  scopesRequired = [],
  isLoading = false,
  error = null,
  children,
  fallbackLoading,
  fallbackForbidden,
}) => {
  const { t } = useTranslation();
  const userScopes = useSelector(selectScopes);

  const isForbidden =
    error?.response?.status === 403 ||
    error?.code === "FORBIDDEN" ||
    error?.error?.code === "FORBIDDEN";

  const hasAccess =
    scopesRequired.length === 0
      ? true
      : scopesRequired.some((scope) => hasScope(userScopes, scope));

  const shouldShowForbidden = isForbidden || !hasAccess;

  if (isLoading) {
    if (fallbackLoading) {
      return <>{fallbackLoading}</>;
    }
    return (
      <div className="access-wrapper-loading">
        <div className="skeleton-loader">
          <div className="skeleton-shimmer"></div>
        </div>
      </div>
    );
  }

  if (shouldShowForbidden) {
    if (fallbackForbidden) {
      return <>{fallbackForbidden}</>;
    }
    return (
      <div className="access-wrapper-forbidden">
        <div className="forbidden-overlay">
          <div className="forbidden-message">
            <p className="forbidden-text">{t("access.insufficientRights")}</p>
            <p className="forbidden-scopes">
              {t("access.requiredScopes", {
                scopes: scopesRequired.join(", "),
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessWrapper;
