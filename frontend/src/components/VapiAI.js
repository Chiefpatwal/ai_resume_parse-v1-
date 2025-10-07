import React, { useState, useEffect } from 'react';
import { Mic, PhoneCall, PhoneOff, Loader2 } from 'lucide-react';

const VapiAI = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callError, setCallError] = useState(null);
  const [isVapiLoaded, setIsVapiLoaded] = useState(false);

  // Vapi Public Key and Assistant ID
  // Replace these with your actual keys from the Vapi dashboard
  const VAPI_PUBLIC_KEY = "YOUR_VAPI_PUBLIC_KEY"; 
  const VAPI_ASSISTANT_ID = "YOUR_VAPI_ASSISTANT_ID"; 

  // Dynamically load the Vapi.js library and set up event listeners
  useEffect(() => {
    // Flag to prevent double loading
    if (window.vapiScriptLoaded) {
        setIsVapiLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.min.js'; // Corrected URL
    script.async = true;

    script.onload = () => {
      // Use a polling mechanism to wait for Vapi to be fully ready
      const checkVapiReady = setInterval(() => {
        if (window.Vapi) {
          clearInterval(checkVapiReady);
          setIsVapiLoaded(true);
          window.vapiScriptLoaded = true;
          
          window.Vapi.on('call-start', () => {
            setIsConnecting(false);
            setIsCalling(true);
            setCallError(null);
          });
          window.Vapi.on('call-end', () => {
            setIsCalling(false);
            setIsConnecting(false);
            setIsListening(false);
            setIsSpeaking(false);
          });
          window.Vapi.on('speech-start', () => setIsSpeaking(true));
          window.Vapi.on('speech-end', () => setIsSpeaking(false));
          window.Vapi.on('error', (e) => {
            setCallError(e.message);
            setIsConnecting(false);
            setIsCalling(false);
          });
        }
      }, 100); // Check every 100ms
    };

    script.onerror = () => {
      setCallError('Failed to load Vapi.js. Check your network connection.');
      setIsVapiLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (window.Vapi && window.Vapi.isCalling()) {
        window.Vapi.stop();
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const startCall = async () => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setCallError('Vapi keys are not configured. Please check your code.');
      return;
    }

    setIsConnecting(true);
    setCallError(null);

    try {
      await window.Vapi.start(VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID);
    } catch (e) {
      setCallError('Failed to start call. Please try again.');
      setIsConnecting(false);
    }
  };

  const stopCall = () => {
    if (window.Vapi && window.Vapi.isCalling()) {
      window.Vapi.stop();
    }
    setIsCalling(false);
  };

  const toggleMute = () => {
    if (window.Vapi) {
      window.Vapi.toggleMute();
      setIsListening(!isListening);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        margin: '0 auto 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isCalling ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
          animation: isSpeaking ? 'pulseRing 2s infinite' : 'none'
        }} />
        <button
          onClick={isCalling ? stopCall : startCall}
          style={{
            position: 'relative',
            background: isCalling ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
            border: 'none',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCalling ? 'white' : '#64748b',
            transition: 'background 0.3s ease'
          }}
          disabled={isConnecting || !isVapiLoaded}
        >
          {isConnecting ? (
            <Loader2 size={32} className="spin" />
          ) : isCalling ? (
            <PhoneOff size={32} />
          ) : (
            <PhoneCall size={32} />
          )}
        </button>
      </div>

      <p style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.5rem'
      }}>
        {isConnecting ? 'Connecting...' : isCalling ? 'Call in progress' : 'Ready to start'}
      </p>

      {callError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          padding: '0.75rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          marginTop: '1rem',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          {callError}
        </div>
      )}

      {isCalling && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={toggleMute}
            style={{
              background: isListening ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0,0,0,0.1)',
              border: isListening ? '1px solid #667eea' : '1px solid rgba(0,0,0,0.2)',
              color: isListening ? '#667eea' : '#64748b',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <Mic size={20} />
            {isListening ? 'Mute Mic' : 'Unmute Mic'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VapiAI;
