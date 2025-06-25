# University of Embu - Student Attendance System

A modern, secure web application for digital student attendance management using multiple check-in methods including QR codes, manual check-in, and kiosk interfaces to accommodate all students regardless of smartphone availability.

## 🚀 Features

### Core Functionality
- **JWT-based Authentication** with role-based access control (RBAC)
- **Multiple Check-in Methods** to ensure inclusivity:
  - QR Code scanning for smartphone users
  - Manual check-in for students without smartphones
  - Kiosk interface for shared device access
  - ID card scanning (future enhancement)
- **Geolocation Validation** to prevent remote check-ins
- **Real-time Dashboards** for all user roles
- **Session Management** with automatic QR code expiry
- **Attendance Analytics** and reporting with method breakdown

### Accessibility Solutions

#### For Students Without Smartphones
1. **Manual Check-in**: Faculty can manually mark attendance using a searchable student list
2. **Kiosk Interface**: Shared tablets/computers in classrooms for self-service check-in
3. **ID Card Integration**: Future support for student ID card scanning
4. **Buddy System**: Students can assist classmates with check-in

#### QR Code Display Solutions
1. **Projector Display**: QR codes shown on classroom projectors/screens
2. **Printed QR Codes**: Physical printouts posted in classrooms
3. **Multiple Display Points**: QR codes shown on various screens around the classroom
4. **Faculty Device Sharing**: Faculty can allow students to scan from their device

### User Roles

#### Students
- Login and view personal attendance records
- Scan QR codes to mark attendance (if smartphone available)
- Use kiosk interface for check-in
- View upcoming sessions and schedules
- Track attendance statistics

#### Faculty
- Create and manage class sessions
- Generate QR codes for attendance with multiple display options
- Enable manual check-in for students without smartphones
- Set up kiosk mode for shared devices
- Monitor real-time attendance with method breakdown
- Export attendance reports (CSV) with check-in method details
- View session analytics

#### Administrators
- Manage users, courses, and system settings
- View comprehensive analytics including accessibility metrics
- Monitor system status and usage patterns
- Generate system-wide reports
- Configure accessibility features

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for analytics visualization
- **QR Scanner** for QR code reading
- **QR Code Generator** for QR code creation

### State Management
- **React Context** for authentication
- **Local Storage** for session persistence

### Security Features
- JWT token authentication
- Role-based access control
- QR code expiration (10 minutes)
- Geolocation validation
- Duplicate check-in prevention
- Method-specific security controls

## 📱 Design Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Accessibility First** - WCAG compliant design with multiple input methods
- **Modern UI/UX** - Clean, professional interface
- **Touch-Friendly** - Optimized for kiosk and tablet use
- **Smooth Animations** and micro-interactions
- **High Contrast Mode** for better visibility

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-attendance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Demo Credentials

The application includes demo credentials for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@embu.ac.ke | password123 |
| Faculty | faculty@embu.ac.ke | password123 |
| Student | student@embu.ac.ke | password123 |

## 📊 Key Components

### Multiple Check-in Methods
- **QR Code System**: Dynamic QR code generation with secure scanning
- **Manual Check-in**: Faculty-controlled attendance marking with student search
- **Kiosk Interface**: Self-service check-in on shared devices
- **Future Enhancements**: ID card scanning, biometric authentication

### Accessibility Features
- **Smartphone Detection**: System tracks which students have smartphones
- **Alternative Method Assignment**: Students without smartphones are assigned alternative check-in methods
- **Inclusive Session Creation**: Faculty can enable multiple check-in methods per session
- **Usage Analytics**: Track which methods are most used for better planning

### Dashboard Features
- **Student Dashboard**: Personal attendance tracking, multiple check-in options
- **Faculty Dashboard**: Session management with method selection, real-time monitoring
- **Admin Dashboard**: User management with accessibility preferences, system analytics

### Attendance Tracking
- **Multi-method Support**: Track attendance regardless of check-in method
- **Method Analytics**: Understand usage patterns across different check-in methods
- **Accessibility Reporting**: Monitor inclusion and accessibility metrics
- **Comprehensive Export**: Include check-in method in all reports

## 🔒 Security Measures

1. **Authentication**: JWT-based with role validation
2. **QR Code Security**: Time-limited codes with unique identifiers
3. **Location Validation**: GPS coordinates verification (when applicable)
4. **Session Management**: Automatic logout and token refresh
5. **Method-Specific Controls**: Different security levels for different check-in methods
6. **Audit Trail**: Complete logging of all check-in methods and attempts

## 📱 Implementation Strategies

### QR Code Display Solutions
1. **Classroom Projectors**: Display QR codes on main screens
2. **Multiple Monitors**: Show QR codes on various displays around the room
3. **Printed Backup**: Physical QR code printouts as fallback
4. **Faculty Device**: Allow scanning directly from instructor's device
5. **Digital Signage**: Use existing digital displays in classrooms

### Device Sharing Solutions
1. **Kiosk Stations**: Dedicated tablets/computers for attendance
2. **Shared Smartphones**: Faculty or student volunteers can assist
3. **Laptop Carts**: Mobile computer stations for large classes
4. **BYOD Support**: Encourage students with devices to help others

### Accessibility Considerations
1. **Large Text Mode**: Enhanced visibility for kiosk interfaces
2. **Voice Guidance**: Audio instructions for check-in process
3. **Multiple Languages**: Support for local languages
4. **Offline Capability**: Basic functionality without internet
5. **Low-Tech Backup**: Paper-based fallback system

## 🚀 Deployment

The application supports multiple deployment scenarios:

- **Standard Web Deployment**: Netlify, Vercel, or similar platforms
- **Kiosk Deployment**: Dedicated tablets with kiosk mode browsers
- **Hybrid Setup**: Web app with physical kiosk stations
- **Docker Containers**: Scalable deployment with included Docker configuration

## 📝 Future Enhancements

### Immediate Priorities
- **ID Card Integration**: Support for student ID card scanning
- **Offline Mode**: Basic functionality without internet connection
- **Voice Commands**: Audio-based check-in for accessibility
- **SMS Integration**: Text-based check-in for feature phones

### Advanced Features
- **Biometric Authentication**: Fingerprint or facial recognition
- **AI-Powered Analytics**: Predictive attendance modeling
- **Integration APIs**: Connect with existing university systems
- **Mobile App**: Native mobile application for enhanced experience

### Accessibility Improvements
- **Screen Reader Support**: Enhanced compatibility with assistive technologies
- **Keyboard Navigation**: Full keyboard-only operation
- **High Contrast Themes**: Better visibility options
- **Multi-language Support**: Localization for diverse student populations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with accessibility in mind
4. Add tests for new check-in methods
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏫 University of Embu

Built for the University of Embu to modernize student attendance tracking while ensuring inclusivity and accessibility for all students, regardless of their access to technology.

### Accessibility Statement

This system is designed with universal access in mind. We are committed to ensuring that all students can participate in the attendance process, whether they have smartphones, basic phones, or no personal devices at all. The system provides multiple pathways to success and maintains the same level of security and accuracy across all check-in methods.

---

**Note**: This is a comprehensive attendance system designed for real-world deployment. The multiple check-in methods ensure that no student is excluded from the digital attendance process due to technology limitations.