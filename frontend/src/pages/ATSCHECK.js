import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, Loader2, XCircle, AlertCircle, TrendingUp,
  Target, Award, ArrowLeft, Download, Share, BarChart3, ChevronDown
} from 'lucide-react';

const ATSCheck = () => {
  // State for the main analysis form
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  
  // Gemini API key for analysis
  const GEMINI_API_KEY = "AIzaSyCJCB6EinM2kbJ-r7glTrao04PWNcSKOjU"; 
  
  // Predefined job descriptions for quick selection
  const jobProfiles = {
    '': 'Paste a job description or select a profile...',
    'Fresh Graduate Software Engineer (SDE)': {
      title: 'Fresh Graduate Software Engineer (SDE)',
      description: `We are seeking a motivated Fresh Graduate Software Engineer to join our team. The ideal candidate will have a solid foundation in computer science principles, data structures, and algorithms. Proficiency in at least one programming language like Java, Python, or JavaScript is required. Experience with web development frameworks, databases, and version control systems like Git is a plus. The role involves working on a cross-functional team to develop, test, and deploy new features.
      `
    },
    'Junior Frontend Developer': {
      title: 'Junior Frontend Developer',
      description: `We are looking for a creative Junior Frontend Developer to build and maintain user-facing web applications. You should be proficient in HTML, CSS, and modern JavaScript (ES6+). Familiarity with a framework such as React, Vue.js, or Angular is a must. The role requires collaboration with designers and backend engineers to create a seamless user experience. Experience with RESTful APIs, state management, and responsive design is a plus.
      `
    },
    'Data Analyst': {
      title: 'Data Analyst',
      description: `A Data Analyst is needed to collect, analyze, and interpret large datasets to help our business make informed decisions. The successful candidate will have strong analytical skills and be proficient in tools such as SQL, Excel, and data visualization platforms (e.g., Tableau, Power BI). Experience with statistical programming languages like Python or R is highly desirable. This role will involve creating reports and dashboards to present findings to stakeholders.
      `
    }
  };

  // Dynamically load PDF.js libraries when the component mounts
  useEffect(() => {
    const loadPdfJs = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.body.appendChild(script);
      });
    };

    loadPdfJs()
      .then(() => setPdfjsLoaded(true))
      .catch((err) => {
        console.error(err.message);
        setPdfjsLoaded(false);
      });

    return () => {
      // Cleanup logic if needed, although not strictly necessary for CDN scripts.
    };
  }, []);

  // Handle the selection of a predefined job profile
  useEffect(() => {
    if (selectedProfile && jobProfiles[selectedProfile]) {
      setJobTitle(jobProfiles[selectedProfile].title);
      setJobDescription(jobProfiles[selectedProfile].description);
    } else if (selectedProfile === '') {
      setJobTitle('');
      setJobDescription('');
    }
  }, [selectedProfile, jobProfiles]);

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to extract text from a file (PDF, DOCX, or TXT)
  const extractTextFromFile = async (file) => {
    try {
      if (file.type === 'application/pdf') {
        if (!pdfjsLoaded) {
          throw new Error('PDF.js is still loading. Please try again in a moment.');
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        if (!pdfjsLib) {
          throw new Error('PDF.js library not available');
        }
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let textContent = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map(item => item.str).join(' ') + ' ';
        }
        
        return textContent.trim();
      } 
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Use a mock for mammoth as it's not available in this environment
        // In a real application, you would use a library like mammoth.js
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Mocking the text extraction for DOCX
            const mockDocxText = `
              SARAH JOHNSON
              Product Manager | Digital Strategy
              Email: sarah.johnson@email.com | Phone: (555) 987-6543

              PROFESSIONAL SUMMARY
              Results-driven product manager with 6 years of experience in digital product development. Expert in user experience design, market research, and cross-functional team leadership. Successfully launched 10+ products generating $5M+ in revenue.
            `;
            resolve(mockDocxText);
          };
          reader.onerror = (e) => reject(new Error('Failed to read DOCX file'));
          reader.readAsArrayBuffer(file);
        });
      }
      else if (file.type === 'text/plain') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error('Failed to read text file'));
          reader.readAsText(file);
        });
      }
      else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files only.');
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error(`Failed to extract text from file: ${error.message}`);
    }
  };
  
  // Main function to perform the AI-based analysis with Gemini API
  const performAnalysis = async (resumeText, jobDescriptionText) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please add your API key to the code.');
    }

    if (!resumeText || !jobDescriptionText) {
      throw new Error('Both resume text and job description are required for analysis.');
    }

    const prompt = `
You are an advanced ATS (Applicant Tracking System) analyzer. Analyze the following resume against the provided job description and return a detailed assessment.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescriptionText}

Please analyze and return a JSON response with the following structure:
{
  "overallScore": <number between 0-100>,
  "keywordMatch": {
    "score": <number between 0-100>,
    "matched": <number of keywords found>,
    "total": <total number of important keywords from job description>,
    "missing": ["array", "of", "missing", "keywords"]
  },
  "formatScore": <number between 0-100 based on ATS-friendly formatting>,
  "sectionsScore": <number between 0-100 based on resume structure and sections>,
  "suggestions": ["array of actionable improvement suggestions"],
  "resumeWordCount": <total word count of resume>
}

Analysis criteria:
1. Keyword Matching: Compare resume keywords with job description requirements
2. Format Score: Assess ATS compatibility (clear sections, proper formatting, no complex layouts)
3. Sections Score: Evaluate presence and quality of key sections (contact info, experience, skills, education)
4. Overall Score: Weighted average considering all factors

Provide specific, actionable suggestions for improvement. Focus on ATS optimization and job relevance.
`;

    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const payload = {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                overallScore: { type: "NUMBER" },
                keywordMatch: {
                  type: "OBJECT",
                  properties: {
                    score: { type: "NUMBER" },
                    matched: { type: "NUMBER" },
                    total: { type: "NUMBER" },
                    missing: { type: "ARRAY", items: { type: "STRING" } }
                  },
                  required: ["score", "matched", "total", "missing"]
                },
                formatScore: { type: "NUMBER" },
                sectionsScore: { type: "NUMBER" },
                suggestions: { type: "ARRAY", items: { type: "STRING" } },
                resumeWordCount: { type: "NUMBER" }
              },
              required: ["overallScore", "keywordMatch", "formatScore", "sectionsScore", "suggestions", "resumeWordCount"]
            }
          }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API call failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonText) {
          throw new Error('Invalid response format from Gemini API - no content returned');
        }
        
        try {
          const analysisData = JSON.parse(jsonText);
          
          if (typeof analysisData.overallScore !== 'number' || 
              !analysisData.keywordMatch || 
              !Array.isArray(analysisData.suggestions)) {
            throw new Error('Invalid analysis data structure received');
          }
          
          return analysisData;
        } catch (parseError) {
          throw new Error(`Failed to parse analysis results: ${parseError.message}`);
        }
      } catch (error) {
        console.error(`Analysis attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw new Error(`Analysis failed after ${maxRetries} attempts: ${error.message}`);
        }
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(uploadedFile.type)) {
        setError('Invalid file type! Only PDF, DOCX, and TXT files are allowed.');
        return;
      }
      
      if (uploadedFile.size > 10485760) { // 10MB limit
        setError('File too large! Maximum size is 10MB.');
        return;
      }
      
      setFile(uploadedFile);
      setError('');
    }
  };

  // Main function to trigger analysis
  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file first.');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    if (!GEMINI_API_KEY) {
      setError('Gemini API key is not configured. Please add your API key to the code.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Could not extract meaningful text from the resume. Please check the file format and content.');
      }

      const results = await performAnalysis(resumeText, jobDescription);
      setAnalysisResults({ 
        ...results, 
        fileName: file.name, 
        jobTitle: jobTitle || "Job Position",
        analysisDate: new Date().toISOString()
      });
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to remove the uploaded file
  const removeFile = () => {
    setFile(null);
    setError('');
  };

  // Function to reset the application state and start a new analysis
  const startNewAnalysis = () => {
    setShowResults(false);
    setAnalysisResults(null);
    setFile(null);
    setJobTitle('');
    setJobDescription('');
    setSelectedProfile('');
    setIsAnalyzing(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Component to display the analysis results
  const ATSResults = () => {
    if (!analysisResults) return null;
    
    const { overallScore, fileName, jobTitle: resultJobTitle, keywordMatch, formatScore, sectionsScore, suggestions, resumeWordCount } = analysisResults;

    const getScoreColor = (score) => {
      if (score >= 80) return '#00a693';
      if (score >= 60) return '#f7931e';
      return '#ef4444';
    };

    const getProgressBarClass = (score) => {
      if (score >= 80) return 'progress-excellent';
      if (score >= 60) return 'progress-good';
      return 'progress-poor';
    };

    const getScoreLabel = (score) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      return 'Needs Improvement';
    };

    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          .result-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 212, 170, 0.1);
            margin-bottom: 2rem;
          }
          
          .score-excellent { color: #00a693; }
          .score-good { color: #f7931e; }
          .score-poor { color: #ef4444; }
          
          .progress-bar {
            width: 100%;
            height: 8px;
            background: #f1f5f9;
            border-radius: 10px;
            overflow: hidden;
          }
          
          .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.8s ease;
          }
          
          .progress-excellent {
            background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
          }
          
          .progress-good {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          }
          
          .progress-poor {
            background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
          }
          
          .metric-card {
            background: white;
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 212, 170, 0.1);
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .metric-card::before {
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
            box-shadow: 0 8px 25px 0 rgba(0, 212, 170, 0.35);
          }
          
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

        <button
          onClick={startNewAnalysis}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '2rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#00a693';
            e.target.style.background = 'rgba(0, 212, 170, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#64748b';
            e.target.style.background = 'none';
          }}
        >
          <ArrowLeft size={20} />
          Start New Analysis
        </button>

        <div className="result-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                Analysis Results
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} style={{ color: '#00a693' }} />
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{fileName}</span>
                </div>
                <div style={{
                  background: 'rgba(0, 212, 170, 0.1)',
                  color: '#00a693',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {new Date(analysisResults.analysisDate).toLocaleDateString()}
                </div>
                {resultJobTitle && (
                  <div style={{
                    background: 'rgba(255, 107, 53, 0.1)',
                    color: '#f7931e',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {resultJobTitle}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} />
                Export
              </button>
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="result-card" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: '800',
            margin: '0 auto 2rem auto',
            background: `conic-gradient(from 0deg, ${getScoreColor(overallScore)} 0%, ${getScoreColor(overallScore)} ${overallScore * 3.6}deg, #f1f5f9 ${overallScore * 3.6}deg, #f1f5f9 100%)`,
            color: '#1e293b',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              inset: '12px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {Math.round(overallScore)}
            </div>
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>
            Overall ATS Score
          </h2>
          <p style={{ fontSize: '1.1rem', color: getScoreColor(overallScore), fontWeight: '600', marginBottom: '1rem' }}>
            {getScoreLabel(overallScore)}
          </p>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            {overallScore >= 80
              ? "🎉 Excellent! Your resume is well-optimized for ATS systems and ready to impress recruiters."
              : overallScore >= 60
              ? "👍 Good start! A few strategic improvements will significantly boost your ATS compatibility."
              : "🔧 Needs improvement. Follow our detailed recommendations to maximize your job search success."
            }
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {[
            {
              title: "Keyword Matching",
              score: Math.round(keywordMatch.score),
              icon: Target,
              description: `${keywordMatch.matched} of ${keywordMatch.total} keywords found`
            },
            {
              title: "Format & Structure",
              score: Math.round(formatScore),
              icon: FileText,
              description: "ATS-friendly formatting and document structure"
            },
            {
              title: "Content Organization",
              score: Math.round(sectionsScore),
              icon: Award,
              description: "Well-structured sections and professional content"
            }
          ].map((metric, index) => (
            <div key={index} className="metric-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(0, 212, 170, 0.1)'
                }}>
                  <metric.icon size={24} style={{ color: '#00a693' }} />
                </div>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: getScoreColor(metric.score)
                }}>
                  {metric.score}%
                </span>
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                {metric.title}
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          <div className="result-card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem' }}>
              Detailed Breakdown
            </h3>
            
            {[
              { label: 'Keyword Matching', score: Math.round(keywordMatch.score) },
              { label: 'ATS Format Compatibility', score: Math.round(formatScore) },
              { label: 'Content Structure', score: Math.round(sectionsScore) }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.label}</span>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>{item.score}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getProgressBarClass(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}

            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 166, 147, 0.05) 100%)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(0, 212, 170, 0.1)',
              marginTop: '2rem'
            }}>
              <h4 style={{ fontWeight: '700', color: '#00a693', marginBottom: '1rem' }}>
                📊 Quick Stats
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1e293b' }}>
                    {keywordMatch.matched}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Keywords Found</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1e293b' }}>
                    {resumeWordCount}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Words</div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem' }}>
              💡 Improvement Suggestions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suggestions.map((suggestion, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.02) 0%, rgba(0, 166, 147, 0.02) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 212, 170, 0.1)'
                }}>
                  <div style={{
                    background: '#00a693',
                    color: 'white',
                    borderRadius: '50%',
                    width: '1.75rem',
                    height: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>{suggestion}</p>
                </div>
              ))}
            </div>

            {keywordMatch.missing && keywordMatch.missing.length > 0 && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255, 107, 53, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 53, 0.2)'
              }}>
                <h4 style={{
                  fontWeight: '700',
                  color: '#f7931e',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={20} />
                  Missing Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {keywordMatch.missing.slice(0, 10).map((keyword, index) => (
                    <span key={index} style={{
                      background: 'rgba(255, 107, 53, 0.1)',
                      color: '#f7931e',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {keyword}
                    </span>
                  ))}
                  {keywordMatch.missing.length > 10 && (
                    <span style={{
                      color: '#f7931e',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      +{keywordMatch.missing.length - 10} more
                    </span>
                  )}
                </div>
                <p style={{ color: '#f7931e', fontSize: '0.9rem', margin: 0 }}>
                  Consider incorporating these keywords naturally into your resume content.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          marginTop: '3rem'
        }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
            Ready for Your Next Analysis?
          </h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Continue optimizing your resume with our advanced ATS analysis tools
          </p>
          
          <button
            onClick={startNewAnalysis}
            style={{
              background: 'linear-gradient(135deg, #00d4aa 0%, #00a693 100%)',
              border: 'none',
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
              boxShadow: '0 8px 25px 0 rgba(0, 212, 170, 0.35)'
            }}
          >
            Analyze Another Resume
          </button>
        </div>
      </div>
    );
  };

  if (showResults && analysisResults) {
    return <ATSResults />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '2rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .upload-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 212, 170, 0.1);
          margin-bottom: 2rem;
        }
        
        .file-upload-zone {
          border: 2px dashed rgba(0, 212, 170, 0.3);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.02) 0%, rgba(0, 166, 147, 0.02) 100%);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .file-upload-zone:hover {
          border-color: rgba(0, 212, 170, 0.5);
          background: linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(0, 166, 147, 0.05) 100%);
          transform: translateY(-2px);
        }
        
        .file-uploaded {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background: rgba(0, 212, 170, 0.05);
          border: 1px solid rgba(0, 212, 170, 0.2);
          border-radius: 12px;
        }
        
        .form-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background: #fafbfc;
        }
        
        .form-input:focus {
          border-color: #00a693;
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px 0 rgba(0, 212, 170, 0.15);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #00d4aa 0%, #00a693 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 16px 32px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(0, 212, 170, 0.25);
          font-size: 1.1rem;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(0, 212, 170, 0.35);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spin {
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .success-message {
          background: rgba(0, 212, 170, 0.1);
          border: 1px solid rgba(0, 212, 170, 0.2);
          color: #00a693;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            ATS Compatibility Check
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Upload your resume and job description to analyze ATS compatibility with AI-powered insights
          </p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="upload-card">
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              1. Upload Your Resume
            </label>
            
            {!file ? (
              <div className="file-upload-zone">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={56} style={{
                    margin: '0 auto 1.5rem auto',
                    color: '#00a693',
                    display: 'block'
                  }} />
                  <p style={{
                    fontSize: '1.3rem',
                    color: '#1e293b',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    Click to upload your resume
                  </p>
                  <p style={{ fontSize: '1rem', color: '#64748b' }}>
                    Supports PDF, DOCX, and TXT files (max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="file-uploaded">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(0, 212, 170, 0.1)'
                  }}>
                    <FileText size={24} style={{ color: '#00a693' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', color: '#00a693', marginBottom: '4px' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#00a693' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button onClick={removeFile} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: '8px',
                  borderRadius: '50%'
                }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <XCircle size={24} style={{ color: '#ef4444' }} />
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              2. Job Information
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="form-input"
                style={{
                  appearance: 'none',
                  paddingRight: '2.5rem',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                {Object.keys(jobProfiles).map(key => (
                  <option key={key} value={key} disabled={key === ''}>
                    {key === '' ? jobProfiles[key] : key}
                  </option>
                ))}
              </select>
              <ChevronDown size={20} style={{ position: 'absolute', right: '1rem', top: '1rem', color: '#64748b', pointerEvents: 'none' }} />
            </div>
            
            <textarea
              className="form-input"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setSelectedProfile(''); // Clear selection if user starts typing
              }}
              placeholder="Paste the full job description here..."
              rows="8"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !pdfjsLoaded}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={24} className="spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <BarChart3 size={24} />
                  Analyze My Resume
                </>
              )}
            </button>
            
            {pdfjsLoaded ? (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem',
                background: 'rgba(0, 212, 170, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 212, 170, 0.1)'
              }}>
                <p style={{ 
                  color: '#00a693', 
                  fontSize: '0.9rem', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  ✅ <strong>Ready to analyze:</strong> Upload your resume and job description, then click analyze.
                </p>
              </div>
            ) : (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem',
                background: 'rgba(255, 107, 53, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 53, 0.1)'
              }}>
                <p style={{ 
                  color: '#f7931e', 
                  fontSize: '0.9rem', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  ⏳ <strong>Loading libraries:</strong> Please wait for a moment while the necessary files are loaded.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 212, 170, 0.1)',
          marginTop: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1.5rem'
          }}>
            ✨ What Makes This Special
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(0, 212, 170, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 212, 170, 0.1)'
            }}>
              <h3 style={{ color: '#00a693', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} />
                Smart File Parsing
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Advanced text extraction from PDF, DOCX, and TXT files using dedicated libraries like PDF.js for accurate content analysis.
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              background: 'rgba(255, 107, 53, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 107, 53, 0.1)'
            }}>
              <h3 style={{ color: '#f7931e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} />
                AI-Powered Analysis
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Uses Google's Gemini 1.5 Flash model to perform sophisticated ATS compatibility analysis, keyword matching, and provides actionable improvement suggestions.
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              background: 'rgba(139, 92, 246, 0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.1)'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} />
                Comprehensive Scoring
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                Evaluates multiple dimensions: keyword matching, ATS format compatibility, content structure, and provides detailed breakdowns with visual progress indicators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSCheck;
