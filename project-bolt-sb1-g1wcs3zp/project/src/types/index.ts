export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  studentId?: string;
  department?: string;
  createdAt: string;
  hasSmartphone?: boolean;
  alternativeCheckIn?: 'manual' | 'card' | 'biometric';
}

export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  qrCode?: string;
  qrExpiry?: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
  allowManualCheckIn?: boolean;
  checkInMethods: ('qr' | 'manual' | 'card' | 'kiosk')[];
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  checkInTime: string;
  latitude: number;
  longitude: number;
  status: 'present' | 'late' | 'absent';
  checkInMethod: 'qr' | 'manual' | 'card' | 'kiosk';
  deviceInfo?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  facultyId: string;
  students: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface KioskSession {
  id: string;
  sessionId: string;
  location: string;
  isActive: boolean;
  studentsCheckedIn: string[];
}