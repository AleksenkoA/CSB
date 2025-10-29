export const SCOPES = {
  // Auth
  AUTH: "scope:auth",

  // Dashboard
  VIEW_DASHBOARD: "scope:view-dashboard",
  VIEW_WITHDRAWALS: "scope:view-withdrawals",

  // Card Configs
  VIEW_CARD_CONFIGS: "scope:view-card-configs",
  UPDATE_CARD_PRICES: "scope:update-card-prices",

  // Cards
  VIEW_CARDS: "scope:view-cards",
  EDIT_CARD: "scope:edit-card",
  BULK_CARDS: "scope:bulk-cards",
  RECALC_CARD_BALANCE: "scope:recalc-card-balance",

  // Transactions
  VIEW_TRANSACTIONS: "scope:view-transactions",
  EXPORT_TRANSACTIONS: "scope:export-transactions",

  // Deposits
  VIEW_DEPOSITS: "scope:view-deposits",
  EXPORT_DEPOSITS: "scope:export-deposits",

  // Promo Codes
  VIEW_PROMOS: "scope:view-promos",
  CREATE_PROMO: "scope:create-promo",
  EDIT_PROMO: "scope:edit-promo",
  DEACTIVATE_PROMO: "scope:deactivate-promo",
  VIEW_PROMO_USAGES: "scope:view-promo-usages",
  EXPORT_PROMOS: "scope:export-promos",
  EXPORT_PROMO_USAGES: "scope:export-promo-usages",

  // Users
  VIEW_USERS: "scope:view-users",
  VIEW_USER: "scope:view-user",
  EDIT_USER: "scope:edit-user",
  BULK_USERS: "scope:bulk-users",
  RESET_USER_2FA: "scope:reset-user-2fa",
  RESET_USER_PASSWORD: "scope:reset-user-password",
  EDIT_USER_PROVIDER_IDS: "scope:edit-user-provider-ids",

  // KYC
  VIEW_KYC: "scope:view-kyc",
  APPROVE_KYC: "scope:approve-kyc",
  REJECT_KYC: "scope:reject-kyc",
  EXPORT_KYC: "scope:export-kyc",

  // FAQ
  VIEW_FAQ: "scope:view-faq",
  CREATE_FAQ: "scope:create-faq",
  EDIT_FAQ: "scope:edit-faq",
  TOGGLE_FAQ: "scope:toggle-faq",
  EXPORT_FAQ: "scope:export-faq",

  // Wallets
  VIEW_WALLETS: "scope:view-wallets",
  VIEW_WALLET: "scope:view-wallet",
  EDIT_WALLET: "scope:edit-wallet",
  EXPORT_WALLETS: "scope:export-wallets",

  // Wallet Transactions
  VIEW_WALLET_TRANSACTIONS: "scope:view-wallet-transactions",
  EXPORT_WALLET_TRANSACTIONS: "scope:export-wallet-transactions",

  // Exports / Audit / Notifications / Health
  VIEW_EXPORTS: "scope:view-exports",
  DELETE_EXPORT: "scope:delete-export",
  VIEW_AUDIT: "scope:view-audit",
  VIEW_NOTIFICATIONS: "scope:view-notifications",
  READ_NOTIFICATION: "scope:read-notification",
  HEALTH: "scope:health",
  METRICS: "scope:metrics",
};

export const hasScope = (userScopes, requiredScope) => {
  if (!userScopes || !Array.isArray(userScopes)) return false;
  return userScopes.includes(requiredScope) || userScopes.includes("*"); // * means all permissions
};

export const hasAnyScope = (userScopes, requiredScopes) => {
  if (!userScopes || !Array.isArray(userScopes)) return false;
  if (userScopes.includes("*")) return true;
  return requiredScopes.some((scope) => userScopes.includes(scope));
};

export const hasAllScopes = (userScopes, requiredScopes) => {
  if (!userScopes || !Array.isArray(userScopes)) return false;
  if (userScopes.includes("*")) return true;
  return requiredScopes.every((scope) => userScopes.includes(scope));
};
