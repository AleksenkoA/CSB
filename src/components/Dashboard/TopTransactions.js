import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatting";
import userIcon1 from "../../assets/icons/user_1.svg";
import userIcon2 from "../../assets/icons/user_2.svg";
import userIcon3 from "../../assets/icons/user_3.svg";
import userIcon4 from "../../assets/icons/user_4.svg";
import userIcon5 from "../../assets/icons/user_5.svg";
import "../../styles/TopTransactions.css";

const TopTransactions = React.memo(({ transactions = [] }) => {
  const { t } = useTranslation();

  const userIcons = useMemo(
    () => [userIcon1, userIcon2, userIcon3, userIcon4, userIcon5],
    []
  );

  return (
    <div className="top-transactions-card">
      <div className="card-header">
        <h3>{t("dashboard.topTransactions")}</h3>
        <div className="dropdown-wrapper">
          <select className="dropdown">
            <option>Transactions</option>
          </select>
        </div>
      </div>
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="no-data">{t("common.loading")}</p>
        ) : (
          transactions.map((user, index) => (
            <div key={index} className="transaction-item">
              <div className="user-avatar">
                <img
                  src={userIcons[index % userIcons.length]}
                  alt={user.userId}
                  className="user-avatar-img"
                />
              </div>
              <div className="user-info">
                <span className="user-id">{user.userId}</span>
                <span className="transaction-count">
                  {user.transactionCount} transactions
                </span>
              </div>
              <div className="transaction-amount">
                {formatCurrency(user.totalAmount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

TopTransactions.displayName = "TopTransactions";

export default TopTransactions;
