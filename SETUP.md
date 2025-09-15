# Setup Guide

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/souravmondal/portfolio.git
cd portfolio
```

### 2. Backend Setup

#### Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE portfolio_dev;
CREATE DATABASE portfolio_prod;
exit
```

#### Environment Configuration

```bash
# Copy environment example and configure
cp frontend/env.example frontend/.env.development
```

Update the following environment variables in your `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEBUG=true
```

#### Run Backend

```bash
# Development mode
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Or with Maven
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend will be available at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Environment Profiles

The application supports multiple environment profiles:

#### Development (`dev`)

- Uses MySQL database with `portfolio_dev` schema
- Debug logging enabled
- H2 console available for testing
- Relaxed security settings

#### Production (`prod`)

- Uses environment variables for database credentials
- Optimized logging and caching
- Enhanced security settings
- Prometheus metrics enabled

#### Test (`test`)

- Uses H2 in-memory database
- Minimal configuration for testing
- Fast startup and teardown

### Environment Variables

#### Backend (Production)

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/portfolio_prod
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Security
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Frontend

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Portfolio
VITE_ENVIRONMENT=production

# Analytics (Optional)
VITE_ANALYTICS_ID=your_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

## 📁 Project Structure

```
portfolio/
├── src/main/java/com/sourav/portfolio/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST controllers
│   ├── model/              # Entity models
│   ├── repository/         # Data repositories
│   ├── service/            # Business logic
│   └── exception/          # Exception handling
├── src/main/resources/
│   ├── application.properties      # Common configuration
│   ├── application-dev.properties  # Development profile
│   ├── application-prod.properties # Production profile
│   └── application-test.properties # Test profile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── target/                 # Maven build output
└── README.md
```

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
./mvnw test

# Run tests with specific profile
./mvnw test -Dspring.profiles.active=test

# Run with coverage
./mvnw test jacoco:report
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker Deployment

#### Backend Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/portfolio-*.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java","-jar","/app.jar"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

#### Docker Compose

```yaml
version: "3.8"
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:mysql://db:3306/portfolio_prod
      - DB_USERNAME=portfolio_user
      - DB_PASSWORD=secure_password
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=portfolio_prod
      - MYSQL_USER=portfolio_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start

- Check Java version (requires Java 17+)
- Verify MySQL is running and accessible
- Check database credentials in application properties

#### Frontend build fails

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (requires Node 18+)
- Verify environment variables are set correctly

#### Database connection issues

- Ensure MySQL is running: `systemctl status mysql`
- Check database exists: `SHOW DATABASES;`
- Verify user permissions: `SHOW GRANTS FOR 'username'@'localhost';`
