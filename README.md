# CSB Admin Dashboard

Комплексная админ-панель для управления пользователями, картами и транзакциями CSB, построенная на React, Redux и i18next.

## Features

- **Authentication Flow**: Login with email/password and OTP verification
- **Scope-Based Access Control**: Element visibility based on user permissions (scopes)
- **Dashboard Metrics**: Key performance indicators with trend indicators
- **Interactive Charts**: User/card growth dynamics (bar chart) and revenue from card sales (line chart)
- **Top Transactions**: Display top 5 transactions with user details
- **Withdrawal History**: Table showing withdrawal records with status
- **Responsive Design**: Mobile and desktop layouts
- **Internationalization**: Full i18next support with English and Russian translations

## Tech Stack

- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Axios** - API requests
- **i18next** - Internationalization
- **Recharts** - Data visualization
- **CSS3** - Styling

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.js        # Main dashboard component
│   │   ├── Header.js           # Header with navigation
│   │   ├── MetricCard.js       # Metric display card
│   │   ├── TopTransactions.js  # Top 5 transactions list
│   │   ├── GrowthChart.js      # Bar chart for growth
│   │   ├── RevenueChart.js     # Line chart for revenue
│   │   └── WithdrawalHistory.js # Withdrawal history table
│   ├── Login.js                # Login form
│   ├── OTPVerification.js      # OTP verification
│   ├── ProtectedRoute.js       # Route protection
│   ├── AccessWrapper.js        # Scope-based access control wrapper
│   └── DateRangePicker.js      # Date range picker component
├── store/
│   ├── index.js                # Redux store configuration
│   └── slices/
│       ├── authSlice.js        # Authentication state
│       └── dashboardSlice.js   # Dashboard data state
├── services/
│   └── api.js                  # Axios API configuration
├── utils/
│   ├── scopes.js               # Scope management utilities
│   └── formatting.js          # Currency and date formatting
├── styles/                      # CSS stylesheets
├── i18n/                       # i18next configuration and translations
├── setupProxy.js               # Development proxy configuration
└── App.js                      # Root component
```

## API Integration

The application connects to the CSB Admin API:

- **Base URL**: `https://api.csb-admin.com/api/v1`
- **Documentation**: https://swintages.gitbook.io/api-reference/

### Test Credentials

- **Email**: test@csb.com
- **Password**: TEST-csb1
- **OTP**: 000000

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

**Note:** Development server uses a proxy (`src/setupProxy.js`) to forward API requests to `https://api.csb-admin.com/api/v1` to avoid CORS issues.

### Build for Production

```bash
npm run build
```

Production builds use the full API URL directly without proxy.

## Deployment

Quick deploy to Vercel:

```bash
npm run build
# Then connect your GitHub repo to vercel.com
```

## Features in Detail

### Scope-Based Access Control

The application uses `AccessWrapper` component to control element visibility based on user scopes:

- `scope:view-dashboard` - Dashboard access
- `scope:view-users` - User management access
- `scope:view-cards` - Card management access
- `scope:view-promos` - Promo codes access
- `scope:view-transactions` - Transaction access
- `scope:view-withdrawals` - Withdrawal access
- `scope:view-wallets` - Account wallets access

Each dashboard block can show three states:

- **Loading** - Skeleton loader while data is fetching
- **Ready** - Normal content display
- **Forbidden** - Dimmed overlay with access denied message

Navigation items are dynamically shown/hidden based on user permissions.

### Currency Formatting

All monetary amounts are formatted as: **$ 10 000,00**

- Space after dollar sign
- Space as thousands separator
- Comma as decimal separator

### Responsive Design

The dashboard adapts to different screen sizes:

- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout
- **Mobile**: Single column stacked layout

## Development

### Adding New Features

1. Create component in `src/components/`
2. Add corresponding CSS in `src/styles/`
3. Update Redux slices if state management needed
4. Add API endpoints in `src/services/api.js`
5. Update translations in `src/i18n/locales/`

### Internationalization

To add a new language:

1. Create new file in `src/i18n/locales/` (e.g., `fr.json`)
2. Add translation keys matching existing structure
3. Update `src/i18n/config.js` to include the new language

## API Endpoints Used

- `POST /auth/login` - User login with email, password, and OTP
- `GET /auth/scopes` - Fetch user scopes/permissions
- `GET /dashboard/summary` - Dashboard metrics and top transactions
- `GET /dashboard/user-card-dynamics` - User and card growth dynamics
- `GET /dashboard/revenue-from-card-sales` - Revenue from card sales
- `GET /dashboard/withdrawals-history` - Withdrawal history

All requests require `Authorization: Bearer <token>` header.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
