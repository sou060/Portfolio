# API Documentation

## 📚 Interactive API Documentation

The API includes comprehensive interactive documentation powered by Swagger/OpenAPI:

- **Development**: http://localhost:5000/swagger-ui.html
- **API Docs (JSON)**: http://localhost:5000/api-docs

### Features

- Interactive API testing interface
- Request/response examples
- Authentication support
- Real-time parameter validation
- Downloadable API specifications

> **Note**: Swagger UI is only enabled in development mode for security reasons.

## Authentication

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 3600
}
```

## Projects

### Get All Projects

```bash
GET /api/projects

# Response
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution",
    "technologies": ["Spring Boot", "React", "MySQL"],
    "githubUrl": "https://github.com/username/project",
    "liveUrl": "https://project.example.com",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Project by ID

```bash
GET /api/projects/{id}

# Response
{
  "id": 1,
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce solution",
  "technologies": ["Spring Boot", "React", "MySQL"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project.example.com",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Create Project (Admin Only)

```bash
POST /api/admin/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "technologies": ["Spring Boot", "React"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project.example.com",
  "imageUrl": "https://example.com/image.jpg"
}

# Response
{
  "id": 2,
  "title": "New Project",
  "description": "Project description",
  "technologies": ["Spring Boot", "React"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project.example.com",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Project (Admin Only)

```bash
PUT /api/admin/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Project",
  "description": "Updated description",
  "technologies": ["Spring Boot", "React", "MySQL"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project.example.com",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Delete Project (Admin Only)

```bash
DELETE /api/admin/projects/{id}
Authorization: Bearer {token}

# Response
{
  "message": "Project deleted successfully"
}
```

## Contact Messages

### Send Contact Message

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your work!"
}

# Response
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your work!",
  "createdAt": "2024-01-01T00:00:00Z",
  "status": "NEW"
}
```

### Get All Messages (Admin Only)

```bash
GET /api/admin/contact
Authorization: Bearer {token}

# Response
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'm interested in your work!",
    "createdAt": "2024-01-01T00:00:00Z",
    "status": "NEW"
  }
]
```

### Update Message Status (Admin Only)

```bash
PUT /api/admin/contact/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "READ"
}

# Response
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your work!",
  "createdAt": "2024-01-01T00:00:00Z",
  "status": "READ"
}
```

## Resume

### Download Resume

```bash
GET /api/resume/download

# Response: PDF file download
```

### Upload Resume (Admin Only)

```bash
POST /api/admin/resume/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

# Form data: file (PDF file)
```

## Analytics

### Get Analytics Summary (Admin Only)

```bash
GET /api/admin/analytics
Authorization: Bearer {token}

# Response
{
  "totalVisitors": 1250,
  "uniqueVisitors": 890,
  "totalPageViews": 3420,
  "averageSessionDuration": 180,
  "topPages": [
    {
      "page": "/",
      "views": 850
    },
    {
      "page": "/projects",
      "views": 420
    }
  ],
  "visitorGrowth": [
    {
      "date": "2024-01-01",
      "visitors": 45
    }
  ]
}
```

## Health & Monitoring

### Health Check

```bash
GET /actuator/health

# Response
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free": 412316016640,
        "threshold": 10485760,
        "exists": true
      }
    }
  }
}
```

### Metrics

```bash
GET /actuator/metrics

# Response
{
  "names": [
    "jvm.memory.used",
    "jvm.gc.pause",
    "http.server.requests",
    "hikaricp.connections"
  ]
}
```

### Prometheus Metrics

```bash
GET /actuator/prometheus

# Response: Prometheus format metrics
```

## Error Responses

### 400 Bad Request

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/projects"
}
```

### 401 Unauthorized

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "/api/admin/projects"
}
```

### 403 Forbidden

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/admin/projects"
}
```

### 404 Not Found

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/projects/999"
}
```

### 500 Internal Server Error

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/projects"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Public endpoints**: 100 requests per minute per IP
- **Authenticated endpoints**: 1000 requests per minute per user
- **Admin endpoints**: 500 requests per minute per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## CORS Configuration

The API supports CORS for the following origins:

- `http://localhost:3000` (development)
- `http://localhost:3001` (development alternative)
- `https://yourdomain.com` (production)

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
Allowed headers: `*`
Credentials: `true`
