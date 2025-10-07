import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { parsePDFResume } from "../services/pdfParser.js";
import { calculateMatchScore, extractJobKeywords } from "../services/keywordMatcher.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for now
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Resume upload endpoint
router.post("/upload-resume", upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    console.log("Resume uploaded:", req.file);

    // Parse the PDF resume
    const parseResult = await parsePDFResume(req.file.path);
    
    if (!parseResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error parsing PDF",
        error: parseResult.error
      });
    }

    // Store resume data (in real app, save to database)
    const resumeData = {
      id: req.file.filename,
      filename: req.file.filename,
      originalname: req.file.originalname,
      uploadDate: new Date().toISOString(),
      parsedData: parseResult.data.parsedData,
      rawText: parseResult.data.rawText,
      metadata: parseResult.data.metadata
    };

    res.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: resumeData.id,
        filename: resumeData.filename,
        originalname: resumeData.originalname,
        uploadDate: resumeData.uploadDate,
        parsedData: resumeData.parsedData,
        wordCount: parseResult.data.rawText.split(' ').length,
        keywordCount: resumeData.parsedData.keywords.length
      }
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading resume",
      error: error.message
    });
  }
});

// Job posting endpoint
router.post("/job-posting", (req, res) => {
  const { title, description, requirements, keywords, minExperience, education } = req.body;
  
  // Extract keywords from job description automatically
  const autoExtractedKeywords = extractJobKeywords(description);
  const allKeywords = [...new Set([...(keywords || []), ...autoExtractedKeywords])];
  
  const jobPosting = {
    id: Date.now().toString(), // In real app, use proper ID generation
    title,
    description,
    requirements,
    keywords: allKeywords,
    minExperience: minExperience || 0,
    education: education || {},
    createdDate: new Date().toISOString()
  };
  
  console.log("Job posting created:", jobPosting);
  
  // TODO: Save job posting to database
  res.json({
    success: true,
    message: "Job posting created successfully",
    job: jobPosting
  });
});

// Resume analysis endpoint
router.post("/analyze-resume", async (req, res) => {
  try {
    const { resumeId, jobDescription, jobKeywords, jobRequirements } = req.body;
    
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required"
      });
    }

    // In a real app, fetch resume data from database
    // For now, we'll re-parse if file exists
    const uploadsPath = path.join(__dirname, "../../uploads");
    const resumePath = path.join(uploadsPath, resumeId);
    
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    // Parse the resume
    const parseResult = await parsePDFResume(resumePath);
    
    if (!parseResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error parsing resume",
        error: parseResult.error
      });
    }

    // Extract keywords from job description if provided
    let keywords = jobKeywords || [];
    if (jobDescription && keywords.length === 0) {
      keywords = extractJobKeywords(jobDescription);
    }

    // Calculate match score
    const matchAnalysis = calculateMatchScore(
      parseResult.data.parsedData,
      keywords,
      jobRequirements || {}
    );
    
    res.json({
      success: true,
      message: "Resume analysis completed",
      analysis: {
        resumeId,
        matchScore: matchAnalysis.overallScore,
        breakdown: matchAnalysis.breakdown,
        matchedKeywords: matchAnalysis.matchedKeywords,
        missingKeywords: matchAnalysis.missingKeywords,
        skillsMatch: matchAnalysis.skillsMatch,
        experienceMatch: matchAnalysis.experienceMatch,
        educationMatch: matchAnalysis.educationMatch,
        suggestions: matchAnalysis.suggestions,
        resumeData: {
          name: parseResult.data.parsedData.personalInfo.name,
          email: parseResult.data.parsedData.contact.email,
          skills: parseResult.data.parsedData.skills,
          experience: parseResult.data.parsedData.experience.jobTitles,
          education: parseResult.data.parsedData.education.degrees
        }
      }
    });

  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Error analyzing resume",
      error: error.message
    });
  }
});

// Get all uploaded resumes
router.get("/resumes", (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, "../../uploads");
    
    if (!fs.existsSync(uploadsPath)) {
      return res.json({
        success: true,
        resumes: []
      });
    }

    const files = fs.readdirSync(uploadsPath);
    const resumes = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const filePath = path.join(uploadsPath, file);
        const stats = fs.statSync(filePath);
        
        return {
          id: file,
          filename: file,
          uploadDate: stats.birthtime.toISOString(),
          size: stats.size
        };
      });

    res.json({
      success: true,
      resumes: resumes
    });
    
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resumes",
      error: error.message
    });
  }
});

// Get specific resume details
router.get("/resume/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const uploadsPath = path.join(__dirname, "../../uploads");
    const resumePath = path.join(uploadsPath, id);
    
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    // Parse the resume to get detailed information
    const parseResult = await parsePDFResume(resumePath);
    
    if (!parseResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error parsing resume",
        error: parseResult.error
      });
    }

    const stats = fs.statSync(resumePath);

    res.json({
      success: true,
      resume: {
        id: id,
        filename: id,
        uploadDate: stats.birthtime.toISOString(),
        size: stats.size,
        parsedData: parseResult.data.parsedData,
        metadata: parseResult.data.metadata,
        wordCount: parseResult.data.rawText.split(' ').length
      }
    });

  } catch (error) {
    console.error("Error fetching resume details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resume details",
      error: error.message
    });
  }
});

export default router;