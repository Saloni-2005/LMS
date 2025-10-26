import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import NavBar from '../components/NavBar';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingModal, setGradingModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assignments/instructor/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleGradeSubmission = async () => {
    if (!grade || grade < 0 || grade > 100) {
      alert('Please enter a valid grade (0-100)');
      return;
    }

    try {
      setGrading(true);
      await API.put(`/assignments/submissions/${selectedSubmission.id}/grade`, {
        grade: parseInt(grade),
        feedback: feedback
      });
      
      alert('Submission graded successfully!');
      setGradingModal(false);
      setGrade('');
      setFeedback('');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (err) {
      console.error('Error grading submission:', err);
      alert(err.response?.data?.message || 'Error grading submission');
    } finally {
      setGrading(false);
    }
  };

  const openGradingModal = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
    setGradingModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    if (grade >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'graded') return submission.isGraded;
    if (filter === 'ungraded') return !submission.isGraded;
    if (filter === 'late') return submission.isLate;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Submissions</h1>
              <p className="text-gray-600">Review and grade student assignment submissions</p>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-book mr-2"></i>
              View Courses
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.isGraded).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => !s.isGraded).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Late</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.isLate).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {['all', 'ungraded', 'graded', 'late'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-alt text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "No students have submitted assignments yet." 
                : `No ${filter} submissions found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          {submission.student.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          submission.isGraded 
                            ? getGradeColor(submission.grade)
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.isGraded ? `${submission.grade}/100` : 'Not Graded'}
                        </span>
                        {submission.isLate && (
                          <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Late
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">
                        <strong>Assignment:</strong> {submission.assignment.title}
                      </p>
                      <p className="text-gray-600 mb-3">
                        <strong>Course:</strong> {submission.course?.title}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        <span>Submitted: {formatDate(submission.submittedAt)}</span>
                        <i className="fas fa-clock ml-4 mr-2"></i>
                        <span>Due: {formatDate(submission.assignment.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {submission.filePath ? (
                        <div className="flex items-center text-blue-600">
                          <i className="fas fa-file mr-2"></i>
                          <span className="font-medium">File submitted</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <i className="fas fa-exclamation-circle mr-2"></i>
                          <span>No file submitted</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => openGradingModal(submission)}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                          submission.isGraded 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        {submission.isGraded ? 'Update Grade' : 'Grade Submission'}
                      </button>
                    </div>
                  </div>

                  {submission.feedback && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                      <p className="text-gray-700">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Submission - {selectedSubmission?.student.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter grade"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setGradingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmission}
                disabled={grading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {grading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Grading...
                  </>
                ) : (
                  'Submit Grade'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
