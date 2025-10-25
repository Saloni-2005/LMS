import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import NavBar from '../components/NavBar';

export default function SubmitAssignment(){
  const { assignmentId } = useParams();
  const [file,setFile] = useState(null);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if(!file) return alert('Select file');
    const fd = new FormData();
    fd.append('file', file);
    try {
      await API.post(`/assignments/submit/${assignmentId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert('Submitted');
      nav('/');
    } catch(err){ alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <h2>Submit Assignment</h2>
        <form onSubmit={handle} className="card">
          <label>File</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button className="btn">Submit</button>
        </form>
      </div>
    </>
  );
}
