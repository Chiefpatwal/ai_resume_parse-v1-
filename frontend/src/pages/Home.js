import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Target, Brain, Lightbulb, ArrowRight, TrendingUp, Users, Award, Clock, Mic } from 'lucide-react';
import VapiAI from '../components/VapiAI.js'; // Import the VapiAI component

function Home() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Simulated API call
        setBackendStatus('connected');
        setBackendData({ status: 'healthy' });
      } catch (error) {
        setBackendStatus('error');
        console.error('Backend connection failed:', error);
      }
    };
    checkBackend();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .hero-gradient {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon-1 {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
        }
        
        .feature-icon-2 {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        }
        
        .feature-icon-3 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 212, 170, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(0, 212, 170, 0.25);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(226, 238, 236, 0.35);
        }
        
        .btn-secondary {
          background: rgba(23, 16, 47, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: 12px;
          color: #00a693;
          font-weight: 600;
          padding: 12px 24px;
          cursor: not-allowed;
          transition: all 0.3s ease;
        }
        
        .btn-voice {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.25);
        }
        
        .btn-voice:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(102, 126, 234, 0.35);
        }
        
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 166, 147, 0.1) 100%);
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-circle:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
          animation-delay: -2s;
        }
        
        .floating-circle:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 10%;
          animation-delay: -4s;
        }
        
        .floating-circle:nth-child(3) {
          width: 60px;
          height: 60px;
          top: 80%;
          left: 20%;
          animation-delay: -6s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .progress-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #00d4aa 0%, #00d4aa var(--progress), #e2e8f0 var(--progress), #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .progress-ring::before {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: white;
        }
        
        .progress-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .voice-assistant-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .voice-assistant-content {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .pulse-ring {
          animation: pulseRing 2s infinite;
        }
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div style={{ padding: '4rem 2rem', position: 'relative' }}>
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
        </div>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '6rem',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '2rem',
            color: '#1e293b'
          }}>
            Beat the ATS,
            <br />
            <span className="hero-gradient">Land the Job</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Optimize your resume for Applicant Tracking Systems and increase your chances
            of getting noticed by recruiters with our AI-powered analysis platform.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem'
          }}>
            <Link to="/ats-check" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{
                fontSize: '1.1rem',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Start ATS Analysis
                <ArrowRight size={20} />
              </button>
            </Link>
            
            <button
              className="btn-voice"
              onClick={() => setShowVoiceAssistant(true)}
              style={{
                fontSize: '1.1rem',
                padding: '16px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Mic size={20} />
              Try Voice Assistant
            </button>
          </div>
          
          {/* Quick Voice Assistant Teaser */}
          <div style={{
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
              <Mic size={24} style={{ color: 'white' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '0.5rem'
              }}>
                🎙️ New: AI Voice Assistant
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Get instant help with resume optimization and career advice through voice chat
              </p>
            </div>
          </div>
        </div>
        
        {/* Voice Assistant Modal */}
        {showVoiceAssistant && (
          <div className="voice-assistant-modal">
            <div className="voice-assistant-content">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0
                }}>
                  AI Voice Assistant
                </h2>
                <button
                  onClick={() => setShowVoiceAssistant(false)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>
              <VapiAI />
            </div>
          </div>
        )}
        
        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '6rem',
          maxWidth: '1200px',
          margin: '0 auto 6rem'
        }}>
          {[
            { number: "1,250+", label: "Resumes Analyzed", icon: Users, progress: 87 },
            { number: "92%", label: "Success Rate", icon: TrendingUp, progress: 92 },
            { number: "3.2x", label: "More Interviews", icon: Award, progress: 78 },
            { number: "24/7", label: "Available", icon: Clock, progress: 100 }
          ].map((stat, index) => (
            <div key={index} className="stat-card card-hover">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 166, 147, 0.1) 100%)'
                }}>
                  <stat.icon size={24} style={{ color: '#00a693' }} />
                </div>
                <div
                  className="progress-ring"
                  style={{ '--progress': `${stat.progress * 3.6}deg` }}
                >
                  <div className="progress-content">
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#00a693'
                    }}>
                      {stat.progress}%
                    </div>
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                {stat.number}
              </div>
              <div style={{
                color: '#64748b',
                fontWeight: '500',
                fontSize: '1rem'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Features Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          marginBottom: '4rem'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Powerful Features
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Everything you need to optimize your resume and land your dream job
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: Target,
                title: "ATS Compatibility Analysis",
                description: "Upload your resume and job description to get detailed compatibility analysis with real-time keyword matching and formatting checks.",
                buttonText: "Check ATS Score",
                available: true,
                iconClass: "feature-icon-1",
                badge: "Available Now"
              },
              {
                icon: Mic,
                title: "AI Voice Assistant",
                description: "Get instant help and guidance through our voice-powered AI assistant. Ask questions about resume optimization, ATS systems, and career advice.",
                buttonText: "Try Voice Chat",
                available: true,
                iconClass: "feature-icon-3",
                badge: "New Feature",
                isVoice: true
              },
              {
                icon: Brain,
                title: "AI-Powered Interview Prep",
                description: "Take personalized quizzes based on your resume content to prepare for interviews and improve your technical knowledge with AI insights.",
                buttonText: "Coming Soon",
                available: false,
                iconClass: "feature-icon-2",
                badge: "Q2 2024"
              }
            ].map((feature, index) => (
              <div key={index} className="card-hover" style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 212, 170, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '150px',
                  height: '150px',
                  background: `linear-gradient(135deg, ${feature.iconClass === 'feature-icon-1' ? 'rgba(0, 212, 170, 0.05)' :
                    feature.iconClass === 'feature-icon-2' ? 'rgba(255, 107, 53, 0.05)' : 'rgba(102, 126, 234, 0.05)'} 0%, transparent 100%)`,
                  borderRadius: '50%',
                  transform: 'translate(50px, -50px)'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: feature.iconClass === 'feature-icon-1' ? 'linear-gradient(135deg, #00d4aa 0%, #00a693 100%)' :
                        feature.iconClass === 'feature-icon-2' ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' :
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                      <feature.icon size={28} style={{ color: 'white' }} />
                    </div>
                    <div style={{
                      background: feature.available ?
                        (feature.badge === "New Feature" ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0, 212, 170, 0.1)') :
                        'rgba(255, 107, 53, 0.1)',
                      color: feature.available ?
                        (feature.badge === "New Feature" ? '#667eea' : '#00a693') :
                        '#f7931e',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {feature.badge}
                    </div>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{
                    color: '#64748b',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    {feature.description}
                  </p>
                  
                  {feature.available ? (
                    feature.isVoice ? (
                      <button
                        className="btn-voice"
                        onClick={() => setShowVoiceAssistant(true)}
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {feature.buttonText}
                        <Mic size={16} />
                      </button>
                    ) : (
                      <Link to="/ats-check" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary" style={{
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          {feature.buttonText}
                          <ArrowRight size={16} />
                        </button>
                      </Link>
                    )
                  ) : (
                    <button className="btn-secondary" style={{
                      width: '100%',
                      padding: '14px 20px',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      {feature.buttonText}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Voice Assistant Feature Highlight */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          maxWidth: '1000px',
          margin: '4rem auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              animation: 'pulse 2s infinite'
            }}>
              <Mic size={40} style={{ color: 'white' }} />
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Meet Your AI Career Assistant
            </h2>
            
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Ask questions, get instant advice, and learn about ATS optimization through natural voice conversations
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              {[
                "How do ATS systems work?",
                "What keywords should I include?",
                "How to format my resume?",
                "Interview preparation tips"
              ].map((question, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  "{question}"
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowVoiceAssistant(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                padding: '16px 32px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Start Voice Chat
              <Mic size={20} />
            </button>
          </div>
        </div>
        
        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          color: 'white',
          maxWidth: '1000px',
          margin: '6rem auto 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300d4aa" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Ready to optimize your resume?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Join thousands of professionals who have improved their job search success with our ATS analysis
            </p>
            <Link to="/ats-check" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                color: '#00a693',
                fontSize: '1.1rem',
                fontWeight: '600',
                padding: '16px 32px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px 0 rgba(0, 212, 170, 0.35)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 8px 25px 0 rgba(255, 255, 255, 0.2)';
              }}
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
