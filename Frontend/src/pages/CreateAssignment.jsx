import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import NavBar from '../components/NavBar';

export default function CreateAssignment(){
  const { courseId } = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [dueDate,setDueDate] = useState('');
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/assignments/${courseId}`, { title, description, dueDate });
      alert('Assignment created');
      nav(`/courses/${courseId}`);
    } catch(err){ alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <h2>Create Assignment</h2>
        <form onSubmit={handle} className="card">
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <button className="btn">Create</button>
        </form>
      </div>
    </>
  );
}