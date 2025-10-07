import React, { useState } from 'react';
import { LogOut, Award, FileText } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  // Mock data for the user's dashboard. In a real application, this would come from a database.
  const [userHistory, setUserHistory] = useState([
    { id: 1, resumeName: 'JohnDoe_SoftwareEngineer.pdf', jobTitle: 'Senior Software Engineer', score: 85, date: '2024-05-10' },
    { id: 2, resumeName: 'JohnDoe_FrontendDev.pdf', jobTitle: 'Frontend Developer', score: 72, date: '2024-04-28' },
    { id: 3, resumeName: 'JohnDoe_WebDev.pdf', jobTitle: 'Full Stack Web Developer', score: 91, date: '2024-04-15' },
  ]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '2rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style>{`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* Dashboard card styling */
        .dashboard-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 212, 170, 0.1);
          margin-bottom: 2rem;
        }

        /* Secondary button styling for logout */
        .btn-secondary {
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: 12px;
          color: #00a693;
          font-weight: 600;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(0, 212, 170, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header section with title and logout button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>
            Dashboard
          </h1>
         
        </div>

        {/* Resume Analysis History Card */}
        <div className="dashboard-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem' }}>
            Resume Analysis History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userHistory.length > 0 ? (
              userHistory.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  background: 'rgba(0, 212, 170, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 212, 170, 0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#00a693', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>{item.resumeName}</p>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Matched to: {item.jobTitle}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00a693', fontWeight: '700' }}>
                      <Award size={20} />
                      Score: {item.score}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b' }}>No analysis history found. Start by analyzing a new resume!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
