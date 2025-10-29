import React from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatting";
import cardArrow from "../../assets/icons/card_arrow.svg";
import arrowIcon from "../../assets/icons/arrow.svg";
import "../../styles/MetricCard.css";

const MetricCard = React.memo(
  ({
    title,
    value,
    subtitle,
    trend,
    description,
    highlighted = false,
    icon = "📊",
    showArrow = false,
    titleSize = null,
    showIndicator = false,
  }) => {
    const { t } = useTranslation();

    return (
      <div
        className={`metric-card ${highlighted ? "highlighted" : ""} ${
          showIndicator ? "with-indicator" : ""
        }`}
      >
        {showArrow && (
          <div className="metric-arrow-circle">
            <img src={arrowIcon} alt="trend" className="metric-arrow-icon" />
          </div>
        )}
        {showIndicator ? (
          <div className="metric-title-input">
            <div className="metric-indicator"></div>
            <h3
              className={`metric-title ${
                titleSize ? `title-size-${titleSize}` : ""
              }`}
            >
              {title}
            </h3>
          </div>
        ) : (
          <h3
            className={`metric-title ${
              titleSize ? `title-size-${titleSize}` : ""
            }`}
          >
            {title}
          </h3>
        )}
        <div
          className={`metric-value ${highlighted ? "highlighted-value" : ""}`}
        >
          {typeof value === "number" &&
          (title.includes("Amount") ||
            title.includes("Revenue") ||
            title.includes("Profit"))
            ? formatCurrency(value)
            : value.toLocaleString()}
        </div>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        {description && <p className="metric-description">{description}</p>}
        {trend && (
          <div className="metric-trend">
            <img src={cardArrow} alt="trend" className="trend-icon" />
            <span>{t("dashboard.comparedTo", { percentage: trend })}</span>
          </div>
        )}
      </div>
    );
  }
);

MetricCard.displayName = "MetricCard";

export default MetricCard;
