import React, { useState, useEffect } from 'react';
import { Monitor, Users, Clock, MapPin, Check, X, Search } from 'lucide-react';
import { Session, User } from '../../types';
import { format } from 'date-fns';

interface KioskInterfaceProps {
  session: Session;
  onCheckIn: (studentId: string, method: 'kiosk') => void;
}

const KioskInterface: React.FC<KioskInterfaceProps> = ({ session, onCheckIn }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [checkedInStudents, setCheckedInStudents] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Mock enrolled students
    const mockStudents: User[] = [
      {
        id: '3',
        email: 'student@embu.ac.ke',
        name: 'John Doe',
        role: 'student',
        studentId: 'CS/2024/001',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        email: 'student2@embu.ac.ke',
        name: 'Jane Smith',
        role: 'student',
        studentId: 'CS/2024/002',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        email: 'student3@embu.ac.ke',
        name: 'Mike Johnson',
        role: 'student',
        studentId: 'CS/2024/003',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = (student: User) => {
    if (!checkedInStudents.has(student.id)) {
      onCheckIn(student.id, 'kiosk');
      setCheckedInStudents(new Set([...checkedInStudents, student.id]));
      setSelectedStudent(student);
      setShowSuccess(true);
      setSearchTerm('');
      
      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedStudent(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Monitor className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance Kiosk</h1>
                <p className="text-gray-600">University of Embu</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {format(new Date(), 'PPP')}
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(), 'p')}
              </div>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{session.courseName}</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span>{session.startTime} - {session.endTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span>{session.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              <span>{checkedInStudents.size} students checked in</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && selectedStudent && (
          <div className="bg-green-100 border border-green-200 rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-600 p-2 rounded-full">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-800">
                  Attendance Marked Successfully!
                </h3>
                <p className="text-green-700">
                  {selectedStudent.name} ({selectedStudent.studentId})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative mb-6">
            <Search className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or student ID to check in..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Student Results */}
          {searchTerm && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => {
                const isCheckedIn = checkedInStudents.has(student.id);
                
                return (
                  <button
                    key={student.id}
                    onClick={() => handleCheckIn(student)}
                    disabled={isCheckedIn}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isCheckedIn
                        ? 'bg-green-50 border-green-200 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          ID: {student.studentId} • {student.department}
                        </p>
                      </div>
                      {isCheckedIn ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Check className="h-5 w-5" />
                          <span className="font-medium">Checked In</span>
                        </div>
                      ) : (
                        <div className="text-blue-600 font-medium">
                          Tap to Check In
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to use this kiosk:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Type your name or student ID in the search box</li>
            <li>Select your name from the results</li>
            <li>Your attendance will be marked automatically</li>
            <li>Wait for the confirmation message</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default KioskInterface;