import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar" style={{
      background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(11, 12, 13) 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '1.5rem',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #00d4aa 0%, #00a693 100%)',
            color: 'white',
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            !!
          </div>
          <span>ATS Resume </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isLoggedIn && (
            <Link
              to="/auth"
              style={{
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                color: '#00d4aa',
                fontWeight: '600',
                border: '1px solid #00d4aa',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#00d4aa';
                e.target.style.color = '#202123';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#00d4aa';
              }}
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link
                to="/"
                style={{
                  textDecoration: 'none',
                  color: '#e0e0e0',
                  fontWeight: '500',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.target.style.color = '#00d4aa'; }}
                onMouseLeave={(e) => { e.target.style.color = '#e0e0e0'; }}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: '#e0e0e0',
                  fontWeight: '500',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.target.style.color = '#00d4aa'; }}
                onMouseLeave={(e) => { e.target.style.color = '#e0e0e0'; }}
              >
                Dashboard
              </Link>
              <Link
                to="/ats-check"
                style={{
                  textDecoration: 'none',
                  color: '#e0e0e0',
                  fontWeight: '500',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.target.style.color = '#00d4aa'; }}
                onMouseLeave={(e) => { e.target.style.color = '#e0e0e0'; }}
              >
                ATS Check
              </Link>
              <button
                onClick={onLogout}
                style={{
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00a693 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#202123',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px 0 rgba(0, 212, 170, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px 0 rgba(0, 212, 170, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(0, 212, 170, 0.25)';
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

