// GIVC Instructor Portal - Simplified version to fix build issues
"use client";
import { useState, useEffect } from 'react';

export default function InstructorPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>GIVC Instructor Portal</h1>
      <p>Welcome to the instructor portal. This is a simplified version to resolve build issues.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <nav style={{ borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              background: activeTab === 'dashboard' ? '#007bff' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            style={{ 
              padding: '0.5rem 1rem', 
              border: 'none', 
              background: activeTab === 'courses' ? '#007bff' : 'transparent',
              color: activeTab === 'courses' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            Courses
          </button>
        </nav>

        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <p>Instructor dashboard content will be restored after fixing build issues.</p>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <h2>Courses</h2>
            <p>Course management features will be restored after fixing build issues.</p>
          </div>
        )}
      </div>
    </div>
  );
}