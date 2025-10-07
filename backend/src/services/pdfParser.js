// src/services/pdfParser.js
import fs from "fs";

export async function parsePDFResume(filePath) {
  try {
    // For now, let's create a mock parser that works
    // You can later integrate with a proper PDF parsing library
    
    console.log(`Parsing PDF: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found");
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Mock parsed data - replace this with actual PDF parsing later
    const mockParsedData = {
      personalInfo: { 
        name: "John Doe" // This would come from actual PDF parsing
      },
      contact: { 
        email: "john.doe@example.com", // This would come from actual PDF parsing
        phone: "+1-555-0123"
      },
      skills: ["JavaScript", "React", "Node.js", "Python"], // Mock skills
      experience: { 
        jobTitles: ["Software Engineer", "Full Stack Developer"]
      },
      education: { 
        degrees: ["Bachelor of Science in Computer Science"]
      },
      keywords: ["software", "development", "programming", "engineering"]
    };
    
    return {
      success: true,
      data: {
        rawText: "Mock extracted text from PDF", // This would be actual extracted text
        metadata: {
          fileSize: stats.size,
          fileName: filePath.split('/').pop(),
          lastModified: stats.mtime
        },
        parsedData: mockParsedData
      }
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper functions for when you implement real PDF parsing
function extractName(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
  
  for (const line of lines.slice(0, 5)) {
    if (namePattern.test(line.trim())) {
      return line.trim();
    }
  }
  return "";
}

function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : "";
}

function extractPhone(text) {
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : "";
}

function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS',
    'SQL', 'MongoDB', 'Express', 'Angular', 'Vue', 'TypeScript', 'PHP',
    'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Docker', 'AWS', 'Azure'
  ];
  
  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

function extractJobTitles(text) {
  const jobTitles = [];
  const commonTitles = [
    'Software Engineer', 'Developer', 'Programmer', 'Analyst', 'Manager',
    'Designer', 'Consultant', 'Specialist', 'Coordinator', 'Associate'
  ];
  
  commonTitles.forEach(title => {
    if (text.toLowerCase().includes(title.toLowerCase())) {
      jobTitles.push(title);
    }
  });
  
  return jobTitles;
}

function extractEducation(text) {
  const degrees = [];
  const degreePatterns = [
    /Bachelor(?:'?s)?\s+(?:of\s+)?(?:Science|Arts|Engineering)/gi,
    /Master(?:'?s)?\s+(?:of\s+)?(?:Science|Arts|Business)/gi,
    /PhD|Ph\.D\.|Doctor(?:ate)?/gi,
    /B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|MBA/gi
  ];
  
  degreePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      degrees.push(...matches);
    }
  });
  
  return [...new Set(degrees)];
}

function extractKeywords(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const commonWords = ['the', 'and', 'with', 'that', 'this', 'for', 'are', 'was', 'were', 'been', 'have', 'has', 'had'];
  
  return Object.entries(wordCount)
    .filter(([word]) => !commonWords.includes(word))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
}