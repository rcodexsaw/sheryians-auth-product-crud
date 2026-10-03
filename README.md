# Sheryians Coding School — Authentication & Product CRUD

A full-stack e-commerce demo implementing the assignment requirements:

- Node.js + Express REST API
- MongoDB + Mongoose
- JWT access + refresh token authentication
- bcrypt password hashing
- httpOnly refresh-token cookie
- express-validator field-level validation
- Protected Product create/update/delete routes
- React frontend for register/login and product CRUD

## Project structure

```text
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- npm

## 1. Backend setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sheryians_ecommerce
ACCESS_TOKEN_SECRET=your_long_random_access_secret
REFRESH_TOKEN_SECRET=your_different_long_random_refresh_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run:

```bash
npm run dev
```

API: `http://localhost:5000`

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Authentication API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login and receive access token |
| POST | `/api/auth/refresh-token` | Public* | Create a new access token using refresh cookie |
| POST | `/api/auth/logout` | Authenticated | Revoke refresh token |
| GET | `/api/auth/me` | Authenticated | Current user |

### Register body

```json
{
  "name": "Rohit Kumar",
  "email": "rohit@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

Register intentionally does not return JWT tokens.

### Login body

```json
{
  "email": "rohit@example.com",
  "password": "Password123"
}
```

The response contains the short-lived access token. The refresh token is stored in an httpOnly cookie and its hash is persisted in MongoDB for revocation.

For authenticated requests send:

```text
Authorization: Bearer <access-token>
```

## Product API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/products` | Authenticated | Create product |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | Get one product |
| PUT | `/api/products/:id` | Authenticated | Update own product |
| DELETE | `/api/products/:id` | Authenticated | Delete own product |

### Product body

```json
{
  "name": "Wireless Headphones",
  "description": "Comfortable Bluetooth headphones",
  "price": 2499,
  "stock": 20,
  "category": "Electronics",
  "imageUrl": "https://example.com/headphones.jpg"
}
```

## Validation and errors

All authentication/product body inputs are validated with `express-validator`. Invalid input returns HTTP 400 with field-level errors such as:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Enter a valid email",
      "location": "body"
    }
  ]
}
```

Product IDs are validated before database lookup. Missing resources return 404. Another user's product cannot be updated or deleted.

## Security notes

- Passwords are never stored as plain text.
- bcrypt uses 12 salt rounds.
- Passwords are never returned by API responses.
- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- Refresh tokens are stored as SHA-256 hashes in the database.
- Refresh tokens are sent through an httpOnly cookie.
- Logout clears the stored refresh-token hash and cookie.
- JWT secrets are loaded from `.env`.
- Generic login failure message avoids revealing whether the email exists.

## Frontend flow

1. Register a new account.
2. Login.
3. React stores the short-lived access token locally for the demo and sends it as a Bearer token.
4. The refresh token remains in an httpOnly cookie and is not readable by frontend JavaScript.
5. If an authenticated request receives 401, the frontend calls `/api/auth/refresh-token` and retries once.
6. Dashboard allows creating, editing and deleting products.

## Submission checklist

- [x] Authentication APIs
- [x] Product CRUD APIs
- [x] express-validator validation
- [x] React frontend
- [x] README
- [ ] Push this repository to GitHub
- [ ] Deploy backend/frontend and add the live links

The assignment asks for both backend and frontend in one repository and submission of the GitHub repository plus live project link.
