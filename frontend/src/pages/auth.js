import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get the intended redirect path from the state, or default to the dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Function to show a temporary message to the user
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Handles input changes to update the form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handles form submission, including validation and simulated API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null); // Clear previous messages

    try {
      // Validation checks
      if (!formData.username || !formData.password) {
        showMessage('Username and password are required', 'error');
        setIsLoading(false);
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        setIsLoading(false);
        return;
      }

      if (!isLogin && formData.password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        setIsLoading(false);
        return;
      }

      // Simulate API call with a 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call the parent's success handler to set the isLoggedIn state
      onLoginSuccess();
      
      // Redirect to the original protected page or the dashboard if none was specified
      navigate(from, { replace: true });
      
      // Show success message
      showMessage(`${isLogin ? 'Login' : 'Signup'} successful!`, 'success');

      // Reset form on success
      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Auth error:', error);
      showMessage('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .auth-container {
          position: relative;
          z-index: 1;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 166, 147, 0.1) 100%);
          animation: float 8s ease-in-out infinite;
        }

        .floating-shape:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 5%;
          animation-delay: -2s;
        }

        .floating-shape:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 70%;
          right: 10%;
          animation-delay: -4s;
        }

        .floating-shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 15%;
          animation-delay: -6s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .form-input {
          transition: all 0.3s ease;
          padding: 1rem 1rem 1rem 3rem;
        }

        .form-input:focus {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px 0 rgba(0, 212, 170, 0.15);
        }

        .btn-primary {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(0, 212, 170, 0.35);
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 1;
        }

        .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          z-index: 1;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .toggle-password:hover {
          color: #00a693;
          background: rgba(0, 212, 170, 0.1);
        }

        .input-with-toggle {
          padding-right: 3rem;
        }

        .card-glow {
          position: relative;
        }

        .card-glow::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 166, 147, 0.1), transparent);
          z-index: -1;
        }

        .message-box {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: fadeInOut 3s forwards;
        }

        .message-success {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
        }

        .message-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 20px); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Message Box */}
      {message && (
        <div className={`message-box message-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="auth-container card-glow" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '3rem',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 212, 170, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #00d4aa 0%, #00a693 100%)',
            borderRadius: '20px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 8px 25px 0 rgba(0, 212, 170, 0.25)'
          }}>
            {isLogin ? '🔐' : '✨'}
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '0.75rem',
            lineHeight: '1.2'
          }}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            {isLogin ? 'Sign in to your account to continue' : 'Join thousands of professionals optimizing their resumes'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Username Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.75rem'
              }}>
                Username
              </label>
              <div className="input-group">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="form-input"
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#fafbfc',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00a693';
                    e.target.style.background = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#fafbfc';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.75rem'
              }}>
                Password
              </label>
              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="form-input input-with-toggle"
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#fafbfc',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00a693';
                    e.target.style.background = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#fafbfc';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>
                  Confirm Password
                </label>
                <div className="input-group">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="form-input input-with-toggle"
                    style={{
                      width: '100%',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: '#fafbfc',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00a693';
                      e.target.style.background = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#fafbfc';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: isLoading ? 0.8 : 1,
                boxShadow: '0 4px 14px 0 rgba(0, 212, 170, 0.25)'
              }}
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              <span>{isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </div>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{
            color: '#64748b',
            fontSize: '0.95rem',
            marginBottom: '1rem'
          }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#00a693',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                fontSize: '0.95rem',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 212, 170, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>

          {/* Additional Info */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(0, 212, 170, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 212, 170, 0.1)',
            marginTop: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.85rem',
              color: '#00a693',
              margin: 0,
              fontWeight: '500'
            }}>
              🚀 Join the growing community of professionals optimizing their resumes with our AI-powered platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;