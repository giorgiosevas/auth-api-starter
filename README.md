# 🔐 Auth API Starter

A production-ready authentication API built with Node.js, Express, PostgreSQL, and Prisma. Features JWT-based authentication with refresh tokens, rate limiting, security headers, and Swagger documentation.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-purple?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🔑 **JWT Authentication** - Access tokens (15min) + Refresh tokens (7 days)
- 📝 **User Registration** - Secure signup with email/password
- 🔓 **User Login** - Authenticate and receive tokens
- 🔄 **Token Refresh** - Seamless token rotation
- 🚪 **Logout** - Single device or all devices
- 🛡️ **Security** - Helmet, CORS, bcrypt password hashing
- 🚦 **Rate Limiting** - Protect against brute force attacks
- 📖 **Swagger Docs** - Interactive API documentation
- 🗄️ **PostgreSQL + Prisma** - Type-safe database access

## 🏗️ Project Structure

```
auth-api-starter/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── config/
│   │   └── index.js       # Configuration management
│   ├── controllers/
│   │   └── authController.js  # Auth business logic
│   ├── lib/
│   │   └── prisma.js      # Prisma client instance
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── rateLimiter.js     # Rate limiting
│   ├── routes/
│   │   ├── auth.js        # Auth routes
│   │   └── index.js       # Route aggregator
│   ├── utils/
│   │   ├── jwt.js         # JWT utilities
│   │   └── response.js    # Response helpers
│   ├── swagger.js         # Swagger configuration
│   └── index.js           # Application entry point
├── .gitignore
├── package.json
├── sample.env             # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/auth-api-starter.git
   cd auth-api-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp sample.env .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations (recommended for production)
   npm run db:migrate
   ```

5. **Start the server**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the API**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs

## 📚 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout (invalidate token) | ❌ |
| POST | `/api/auth/logout-all` | Logout from all devices | ✅ |
| GET | `/api/auth/me` | Get current user profile | ✅ |
| GET | `/api/health` | Health check | ❌ |

## 🔧 API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "MySecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "MySecurePassword123"
  }'
```

### Access protected route
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Minimum 8 characters required
- Never stored or returned in plain text

### JWT Tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Refresh token rotation on each use
- Tokens stored in database for revocation

### Rate Limiting
| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 10 requests | 15 minutes |
| Login | 5 failed attempts | 1 hour |

### Security Headers (Helmet)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Content-Security-Policy

## ⚙️ Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `JWT_SECRET` | Secret for signing JWTs | - |
| `JWT_EXPIRES_IN` | Access token expiry | 15m |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🛠️ Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (with nodemon)
npm run db:generate # Generate Prisma client
npm run db:push    # Push schema to database
npm run db:migrate # Run database migrations
npm run db:studio  # Open Prisma Studio (DB GUI)
```

## 📝 Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| password | String | Hashed password |
| firstName | String? | Optional first name |
| lastName | String? | Optional last name |
| isActive | Boolean | Account status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### RefreshToken
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| token | String | Unique token value |
| userId | UUID | Foreign key to User |
| expiresAt | DateTime | Token expiration |
| createdAt | DateTime | Creation timestamp |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Swagger](https://swagger.io/) - API documentation
- [Helmet](https://helmetjs.github.io/) - Security middleware

---

**Built with ❤️ for developers who want a solid authentication foundation**

