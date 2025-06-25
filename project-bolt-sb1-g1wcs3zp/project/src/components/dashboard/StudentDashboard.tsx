import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, MapPin, QrCode, TrendingUp, Book } from 'lucide-react';
import QRScanner from '../attendance/QRScanner';
import { Attendance, Session } from '../../types';
import { format } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockAttendance: Attendance[] = [
      {
        id: '1',
        sessionId: 'cs101-001',
        studentId: user?.id || '',
        studentName: user?.name || '',
        checkInTime: '2024-01-15T08:30:00Z',
        latitude: -0.5143,
        longitude: 37.4650,
        status: 'present'
      },
      {
        id: '2',
        sessionId: 'cs102-001',
        studentId: user?.id || '',
        studentName: user?.name || '',
        checkInTime: '2024-01-14T10:15:00Z',
        latitude: -0.5143,
        longitude: 37.4650,
        status: 'present'
      }
    ];

    const mockSessions: Session[] = [
      {
        id: 'cs101-002',
        courseId: 'cs101',
        courseName: 'Introduction to Programming',
        facultyId: '2',
        facultyName: 'Dr. Jane Smith',
        date: '2024-01-16',
        startTime: '08:00',
        endTime: '10:00',
        location: 'Lab 1',
        isActive: true
      },
      {
        id: 'cs102-002',
        courseId: 'cs102',
        courseName: 'Data Structures',
        facultyId: '2',
        facultyName: 'Dr. Jane Smith',
        date: '2024-01-16',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Room 205',
        isActive: true
      }
    ];

    setAttendanceRecords(mockAttendance);
    setUpcomingSessions(mockSessions);
  }, [user]);

  const attendanceStats = {
    total: 20,
    present: 18,
    late: 1,
    absent: 1,
    percentage: 90
  };

  const handleScanSuccess = (sessionId: string) => {
    // In real app, this would make an API call to mark attendance
    console.log('Attendance marked for session:', sessionId);
    setShowScanner(false);
    // Update attendance records
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
            <p className="text-blue-100 mt-1">Student ID: {user?.studentId}</p>
            <p className="text-blue-100">Department: {user?.department}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{attendanceStats.percentage}%</div>
            <div className="text-blue-100">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
              <p className="text-gray-600 mt-1">Scan QR code to check in</p>
            </div>
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          <button
            onClick={() => setShowScanner(true)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Scan QR Code
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance Summary</h3>
              <p className="text-gray-600 mt-1">Your attendance overview</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
              <div className="text-sm text-green-800">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
              <div className="text-sm text-red-800">Absent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Sessions
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Book className="h-4 w-4 mr-2 text-gray-400" />
                    {session.courseName}
                  </h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.startTime} - {session.endTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {session.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{session.date}</div>
                  <div className="text-sm text-gray-500">{session.facultyName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="p-6 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Session {record.sessionId}</div>
                <div className="text-sm text-gray-600">
                  {format(new Date(record.checkInTime), 'PPP p')}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                record.status === 'present' 
                  ? 'bg-green-100 text-green-800'
                  : record.status === 'late'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {record.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;