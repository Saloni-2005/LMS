import React, { useState } from 'react';
import API from '../api/axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

export default function CreateCourse(){
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/courses', { title, description });
      alert('Course created successfully!');
      nav('/courses');
    } catch(err) { 
      alert(err.response?.data?.message || 'Error creating course'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Design and launch your course to share knowledge with students</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handle} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e=>setTitle(e.target.value)}
                placeholder="Enter an engaging course title"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e=>setDescription(e.target.value)}
                placeholder="Describe what students will learn in this course"
                rows="6"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Course Preview */}
            {(title || description) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Course Preview</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {title || 'Course Title'}
                  </h4>
                  <p className="text-gray-600">
                    {description || 'Course description will appear here...'}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => nav('/courses')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !description.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            <i className="fas fa-lightbulb mr-2"></i>
            Course Creation Tips
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-2 mt-1"></i>
              <span>Choose a clear, descriptive title that tells students what they'll learn</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-2 mt-1"></i>
              <span>Write a detailed description including learning objectives and prerequisites</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle mr-2 mt-1"></i>
              <span>You can add lectures and assignments after creating the course</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}