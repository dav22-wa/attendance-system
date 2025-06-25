import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, Calendar, Clock, MapPin, QrCode, Download, Eye, UserCheck, Monitor } from 'lucide-react';
import QRGenerator from '../attendance/QRGenerator';
import ManualCheckIn from '../attendance/ManualCheckIn';
import KioskInterface from '../attendance/KioskInterface';
import { Session, Attendance, Course } from '../../types';
import { format } from 'date-fns';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);
  const [showKiosk, setShowKiosk] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  // Mock data
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: 'cs101',
        name: 'Introduction to Programming',
        code: 'CS101',
        department: 'Computer Science',
        facultyId: user?.id || '',
        students: ['1', '2', '3']
      },
      {
        id: 'cs102',
        name: 'Data Structures',
        code: 'CS102',
        department: 'Computer Science',
        facultyId: user?.id || '',
        students: ['1', '2', '4']
      }
    ];

    const mockSessions: Session[] = [
      {
        id: 'cs101-001',
        courseId: 'cs101',
        courseName: 'Introduction to Programming',
        facultyId: user?.id || '',
        facultyName: user?.name || '',
        date: '2024-01-15',
        startTime: '08:00',
        endTime: '10:00',
        location: 'Lab 1',
        isActive: false,
        latitude: -0.5143,
        longitude: 37.4650,
        checkInMethods: ['qr', 'manual', 'kiosk'],
        allowManualCheckIn: true
      },
      {
        id: 'cs101-002',
        courseId: 'cs101',
        courseName: 'Introduction to Programming',
        facultyId: user?.id || '',
        facultyName: user?.name || '',
        date: '2024-01-16',
        startTime: '08:00',
        endTime: '10:00',
        location: 'Lab 1',
        isActive: true,
        qrCode: 'mock-qr-data',
        qrExpiry: '2024-01-16T08:10:00Z',
        latitude: -0.5143,
        longitude: 37.4650,
        checkInMethods: ['qr', 'manual', 'kiosk'],
        allowManualCheckIn: true
      }
    ];

    const mockAttendance: Attendance[] = [
      {
        id: '1',
        sessionId: 'cs101-001',
        studentId: '3',
        studentName: 'John Doe',
        checkInTime: '2024-01-15T08:05:00Z',
        latitude: -0.5143,
        longitude: 37.4650,
        status: 'present',
        checkInMethod: 'qr'
      }
    ];

    setCourses(mockCourses);
    setSessions(mockSessions);
    setAttendanceData(mockAttendance);
  }, [user]);

  const handleCreateSession = (sessionData: any) => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      courseId: sessionData.courseId,
      courseName: courses.find(c => c.id === sessionData.courseId)?.name || '',
      facultyId: user?.id || '',
      facultyName: user?.name || '',
      date: sessionData.date,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      location: sessionData.location,
      isActive: true,
      qrCode: `qr-${Date.now()}`,
      qrExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      latitude: sessionData.latitude,
      longitude: sessionData.longitude,
      checkInMethods: sessionData.checkInMethods || ['qr', 'manual'],
      allowManualCheckIn: sessionData.allowManualCheckIn || true
    };

    setSessions([newSession, ...sessions]);
    setShowCreateSession(false);
  };

  const handleManualCheckIn = (studentIds: string[], method: 'manual') => {
    if (!selectedSession) return;

    const newAttendance = studentIds.map(studentId => ({
      id: `attendance-${Date.now()}-${studentId}`,
      sessionId: selectedSession.id,
      studentId,
      studentName: `Student ${studentId}`,
      checkInTime: new Date().toISOString(),
      latitude: selectedSession.latitude || 0,
      longitude: selectedSession.longitude || 0,
      status: 'present' as const,
      checkInMethod: method
    }));

    setAttendanceData([...attendanceData, ...newAttendance]);
  };

  const handleKioskCheckIn = (studentId: string, method: 'kiosk') => {
    if (!selectedSession) return;

    const newAttendance: Attendance = {
      id: `attendance-${Date.now()}-${studentId}`,
      sessionId: selectedSession.id,
      studentId,
      studentName: `Student ${studentId}`,
      checkInTime: new Date().toISOString(),
      latitude: selectedSession.latitude || 0,
      longitude: selectedSession.longitude || 0,
      status: 'present',
      checkInMethod: method
    };

    setAttendanceData([...attendanceData, newAttendance]);
  };

  const getAttendanceCount = (sessionId: string) => {
    return attendanceData.filter(a => a.sessionId === sessionId).length;
  };

  const getAttendanceByMethod = (sessionId: string) => {
    const sessionAttendance = attendanceData.filter(a => a.sessionId === sessionId);
    return {
      qr: sessionAttendance.filter(a => a.checkInMethod === 'qr').length,
      manual: sessionAttendance.filter(a => a.checkInMethod === 'manual').length,
      kiosk: sessionAttendance.filter(a => a.checkInMethod === 'kiosk').length,
      card: sessionAttendance.filter(a => a.checkInMethod === 'card').length
    };
  };

  const exportAttendance = (sessionId: string) => {
    const sessionAttendance = attendanceData.filter(a => a.sessionId === sessionId);
    const csvContent = [
      ['Student Name', 'Check-in Time', 'Status', 'Method'],
      ...sessionAttendance.map(a => [a.studentName, a.checkInTime, a.status, a.checkInMethod])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${sessionId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h2>
          <p className="text-gray-600">Manage your classes and track attendance</p>
        </div>
        <button
          onClick={() => setShowCreateSession(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Session</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.students.length, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions.map((session) => {
            const attendanceByMethod = getAttendanceByMethod(session.id);
            const totalAttendance = getAttendanceCount(session.id);
            
            return (
              <div key={session.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{session.courseName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.isActive ? 'ACTIVE' : 'ENDED'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(session.date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {session.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {totalAttendance} attended
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Methods Breakdown */}
                {totalAttendance > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Check-in Methods:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <QrCode className="h-3 w-3 text-blue-600" />
                        <span>QR: {attendanceByMethod.qr}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserCheck className="h-3 w-3 text-green-600" />
                        <span>Manual: {attendanceByMethod.manual}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3 text-purple-600" />
                        <span>Kiosk: {attendanceByMethod.kiosk}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-orange-600" />
                        <span>Card: {attendanceByMethod.card}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {session.isActive && session.qrCode && (
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>QR Code</span>
                    </button>
                  )}
                  
                  {session.allowManualCheckIn && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowManualCheckIn(true);
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Manual Check-in</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setShowKiosk(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Kiosk Mode</span>
                  </button>

                  <button
                    onClick={() => exportAttendance(session.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateSession && (
        <CreateSessionModal
          courses={courses}
          onSubmit={handleCreateSession}
          onClose={() => setShowCreateSession(false)}
        />
      )}

      {/* QR Code Modal */}
      {selectedSession && !showManualCheckIn && !showKiosk && (
        <QRGenerator
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Manual Check-in Modal */}
      {showManualCheckIn && selectedSession && (
        <ManualCheckIn
          session={selectedSession}
          onClose={() => {
            setShowManualCheckIn(false);
            setSelectedSession(null);
          }}
          onCheckIn={handleManualCheckIn}
        />
      )}

      {/* Kiosk Interface */}
      {showKiosk && selectedSession && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                setShowKiosk(false);
                setSelectedSession(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <KioskInterface
            session={selectedSession}
            onCheckIn={handleKioskCheckIn}
          />
        </div>
      )}
    </div>
  );
};

// Enhanced Create Session Modal Component
const CreateSessionModal: React.FC<{
  courses: Course[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ courses, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    latitude: -0.5143,
    longitude: 37.4650,
    checkInMethods: ['qr', 'manual'] as string[],
    allowManualCheckIn: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleCheckInMethod = (method: string) => {
    const methods = formData.checkInMethods.includes(method)
      ? formData.checkInMethods.filter(m => m !== method)
      : [...formData.checkInMethods, method];
    
    setFormData({ ...formData, checkInMethods: methods });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Session</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Room 101, Lab A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Methods</label>
            <div className="space-y-2">
              {[
                { key: 'qr', label: 'QR Code Scanning', icon: QrCode },
                { key: 'manual', label: 'Manual Check-in', icon: UserCheck },
                { key: 'kiosk', label: 'Kiosk Interface', icon: Monitor }
              ].map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.checkInMethods.includes(key)}
                    onChange={() => toggleCheckInMethod(key)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyDashboard;