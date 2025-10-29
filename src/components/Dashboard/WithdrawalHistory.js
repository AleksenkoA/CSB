import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDate, formatCurrency } from "../../utils/formatting";
import "../../styles/WithdrawalHistory.css";

const WithdrawalHistory = React.memo(({ withdrawals = [] }) => {
  const { t } = useTranslation();

  const sampleData = useMemo(
    () => [
      { date: "2025-08-01", amount: 250.0, status: "Successfully" },
      { date: "2025-07-30", amount: 150.0, status: "Successfully" },
      { date: "2025-07-29", amount: 1550.0, status: "Cancel" },
      { date: "2025-07-27", amount: 250.0, status: "Successfully" },
      { date: "2025-07-23", amount: 150.0, status: "Successfully" },
      { date: "2025-07-19", amount: 1350.0, status: "Cancel" },
      { date: "2025-07-19", amount: 1550.0, status: "Cancel" },
      { date: "2025-07-17", amount: 150.0, status: "Successfully" },
    ],
    []
  );

  const data = useMemo(
    () => (withdrawals.length > 0 ? withdrawals : sampleData),
    [withdrawals, sampleData]
  );

  return (
    <div className="withdrawal-history-card">
      <h3>{t("dashboard.withdrawalHistory")}</h3>
      <table className="withdrawal-table">
        <thead>
          <tr>
            <th>{t("common.date")}</th>
            <th>{t("common.amount")}</th>
            <th>{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-data">
                {t("common.loading")}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.date)}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status === "Successfully"
                      ? t("common.successfully")
                      : t("common.canceled")}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

WithdrawalHistory.displayName = "WithdrawalHistory";

export default WithdrawalHistory;
