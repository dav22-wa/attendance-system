
# University of Embu Digital Attendance System

A comprehensive web-based attendance management system with QR code check-in functionality, role-based access control, and real-time monitoring capabilities.

## 🎯 Features

### Core Functionality
- **QR Code Attendance**: Students scan QR codes to mark attendance
- **Role-Based Access Control**: Student, Faculty, and Admin roles with different permissions
- **Real-time Monitoring**: Live attendance tracking and analytics
- **Geolocation Validation**: Location-based attendance verification
- **Session Management**: Time-limited QR codes with automatic expiration
- **Duplicate Prevention**: Prevent multiple check-ins for the same session

### User Roles
- **Students**: View personal attendance records, scan QR codes
- **Faculty**: Create sessions, generate QR codes, view class attendance
- **Admin**: Manage users, courses, system analytics, export reports

### Security Features
- JWT-based authentication
- Session QR codes expire after 10 minutes
- Geolocation verification
- Role-based route protection
- Password hashing with bcrypt

## 🛠️ Technology Stack

### Frontend
- React 18 with Hooks
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- QR code scanner integration

### Backend
- Node.js with Express
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests
- QR code generation library

### Database
- PostgreSQL with structured schema
- User management tables
- Session and attendance tracking
- Course and enrollment management

## 📁 Project Structure

```
attendance-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── student/
│   │   │   ├── faculty/
│   │   │   └── admin/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── config/
│   └── package.json
├── database/
│   └── schema.sql
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb attendance_system
   
   # Run migrations
   psql -d attendance_system -f database/schema.sql
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Environment Variables

Create `.env` file in the backend directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_system
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Individual Docker Commands

```bash
# Build backend image
docker build -t attendance-backend ./backend

# Build frontend image
docker build -t attendance-frontend ./frontend

# Run PostgreSQL
docker run -d --name postgres-db \
  -e POSTGRES_DB=attendance_system \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:13

# Run backend
docker run -d --name attendance-backend \
  --link postgres-db:postgres \
  -p 5000:5000 attendance-backend

# Run frontend
docker run -d --name attendance-frontend \
  -p 3000:3000 attendance-frontend
```

## 👥 Default Users

After running the database setup, you can use these default accounts:

### Admin Account
- **Email**: admin@uoem.ac.ke
- **Password**: admin123
- **Role**: Admin

### Faculty Account
- **Email**: faculty@uoem.ac.ke
- **Password**: faculty123
- **Role**: Faculty

### Student Account
- **Email**: student@uoem.ac.ke
- **Password**: student123
- **Role**: Student

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/student/attendance` - Get student attendance records
- `POST /api/student/checkin` - Mark attendance via QR code

### Faculty
- `GET /api/faculty/courses` - Get faculty courses
- `POST /api/faculty/session` - Create new session
- `GET /api/faculty/session/:id/qr` - Generate QR code
- `GET /api/faculty/session/:id/attendance` - View session attendance

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/reports` - Export reports

## 🔧 Configuration

### QR Code Settings
- **Expiration Time**: 10 minutes (configurable)
- **Geolocation Radius**: 100 meters (configurable)
- **Session Duration**: 2 hours (configurable)

### Security Settings
- **JWT Expiration**: 24 hours
- **Password Min Length**: 6 characters
- **Max Login Attempts**: 5 per hour

## 📊 Features Overview

### Student Features
- Personal attendance dashboard
- QR code scanning interface
- Attendance history and statistics
- Mobile-responsive design

### Faculty Features
- Course and session management
- Real-time attendance monitoring
- QR code generation and display
- Attendance reports and analytics

### Admin Features
- User management (CRUD operations)
- System-wide analytics
- Course and enrollment management
- Export functionality (CSV/PDF)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   # Update database credentials
   # Set secure JWT secret
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   npm run start
   ```

### Hosting Options
- **Render**: Free tier available
- **Vercel**: For frontend deployment
- **Heroku**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🔒 Security Best Practices

- Use environment variables for sensitive data
- Implement rate limiting
- Validate all user inputs
- Use HTTPS in production
- Regular security audits
- Keep dependencies updated

## 📈 Monitoring

- Application logs
- Database performance metrics
- User activity tracking
- Error reporting
- Attendance statistics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@uoem.ac.ke
- Documentation: [Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic attendance functionality
- QR code integration
- Role-based access control
- Admin dashboard
- Export functionality

---

**Built with ❤️ for University of Embu**
