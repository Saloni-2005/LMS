import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Dashboard(){
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/dashboard/stats');
      setStats(res.data);
    } catch(err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fas fa-graduation-cap text-4xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-book text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeCourses || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tasks text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalAssignments || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-certificate text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.certificates || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
            <div className="space-y-4">
              {stats?.recentCourses && stats.recentCourses.length > 0 ? (
                stats.recentCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                      <i className={`fas ${index % 2 === 0 ? 'fa-code text-blue-600' : 'fa-database text-green-600'}`}></i>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className={`${index % 2 === 0 ? 'bg-blue-600' : 'bg-green-600'} h-2 rounded-full`} style={{width: `${course.progress}%`}}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-book text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600">No courses enrolled yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                stats.upcomingDeadlines.map((assignment, index) => {
                  const dueDate = new Date(assignment.dueDate);
                  const now = new Date();
                  const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={assignment.id} className={`flex items-center p-4 ${daysLeft <= 2 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'} rounded-lg`}>
                      <div className={`w-10 h-10 ${daysLeft <= 2 ? 'bg-red-100' : 'bg-yellow-100'} rounded-lg flex items-center justify-center`}>
                        <i className={`fas ${daysLeft <= 2 ? 'fa-exclamation text-red-600' : 'fa-clock text-yellow-600'}`}></i>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className={`text-sm ${daysLeft <= 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                          Due in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-calendar text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}