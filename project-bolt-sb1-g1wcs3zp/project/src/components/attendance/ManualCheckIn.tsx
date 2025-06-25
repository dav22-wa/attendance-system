import React, { useState, useEffect } from 'react';
import { X, Users, Search, Check, Clock, MapPin } from 'lucide-react';
import { Session, User } from '../../types';
import { format } from 'date-fns';

interface ManualCheckInProps {
  session: Session;
  onClose: () => void;
  onCheckIn: (studentIds: string[], method: 'manual') => void;
}

const ManualCheckIn: React.FC<ManualCheckInProps> = ({ session, onClose, onCheckIn }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [checkedInStudents, setCheckedInStudents] = useState<Set<string>>(new Set());

  // Mock enrolled students
  useEffect(() => {
    const mockStudents: User[] = [
      {
        id: '3',
        email: 'student@embu.ac.ke',
        name: 'John Doe',
        role: 'student',
        studentId: 'CS/2024/001',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z',
        hasSmartphone: true
      },
      {
        id: '4',
        email: 'student2@embu.ac.ke',
        name: 'Jane Smith',
        role: 'student',
        studentId: 'CS/2024/002',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z',
        hasSmartphone: false,
        alternativeCheckIn: 'manual'
      },
      {
        id: '5',
        email: 'student3@embu.ac.ke',
        name: 'Mike Johnson',
        role: 'student',
        studentId: 'CS/2024/003',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z',
        hasSmartphone: false,
        alternativeCheckIn: 'manual'
      },
      {
        id: '6',
        email: 'student4@embu.ac.ke',
        name: 'Sarah Wilson',
        role: 'student',
        studentId: 'CS/2024/004',
        department: 'Computer Science',
        createdAt: '2024-01-01T00:00:00Z',
        hasSmartphone: true
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkCheckIn = () => {
    if (selectedStudents.size > 0) {
      onCheckIn(Array.from(selectedStudents), 'manual');
      setCheckedInStudents(new Set([...checkedInStudents, ...selectedStudents]));
      setSelectedStudents(new Set());
    }
  };

  const handleIndividualCheckIn = (studentId: string) => {
    onCheckIn([studentId], 'manual');
    setCheckedInStudents(new Set([...checkedInStudents, studentId]));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Manual Check-In
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {session.courseName} • {format(new Date(session.date), 'PPP')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info */}
        <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                {session.startTime} - {session.endTime}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                {session.location}
              </div>
            </div>
            <div className="text-blue-700 font-medium">
              {checkedInStudents.size} students checked in
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleBulkCheckIn}
              disabled={selectedStudents.size === 0}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Check In Selected ({selectedStudents.size})</span>
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const isSelected = selectedStudents.has(student.id);
              const isCheckedIn = checkedInStudents.has(student.id);
              
              return (
                <div
                  key={student.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50' : ''
                  } ${isCheckedIn ? 'bg-green-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudent(student.id)}
                        disabled={isCheckedIn}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          {!student.hasSmartphone && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              No Smartphone
                            </span>
                          )}
                          {isCheckedIn && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Checked In
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          ID: {student.studentId} • {student.department}
                        </p>
                      </div>
                    </div>
                    
                    {!isCheckedIn && (
                      <button
                        onClick={() => handleIndividualCheckIn(student.id)}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        <Check className="h-3 w-3" />
                        <span>Check In</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredStudents.length}</span> students enrolled •{' '}
              <span className="font-medium">{checkedInStudents.size}</span> checked in •{' '}
              <span className="font-medium">{selectedStudents.size}</span> selected
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualCheckIn;