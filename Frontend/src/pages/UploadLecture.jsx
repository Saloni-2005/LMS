import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import NavBar from '../components/NavBar';

export default function UploadLecture(){
  const { courseId } = useParams();
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [file,setFile] = useState(null);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if(!file) return alert('Select a file');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('video', file);
    try {
      await API.post(`/lectures/${courseId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert('Uploaded');
      nav(`/courses/${courseId}`);
    } catch(err){ alert(err.response?.data?.message || 'Upload error'); }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <h2>Upload Lecture</h2>
        <form onSubmit={handle} className="card">
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Video File</label>
          <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} />
          <button className="btn">Upload</button>
        </form>
      </div>
    </>
  );
}