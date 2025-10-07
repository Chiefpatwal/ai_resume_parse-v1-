/**
 * ATS Keyword Matching Service
 * Analyzes resume content against job requirements
 */

/**
 * Calculate match score between resume and job requirements
 * @param {Object} resumeData - Parsed resume data
 * @param {Array} jobKeywords - Required keywords from job posting
 * @param {Object} jobRequirements - Job requirements object
 * @returns {Object} - Matching analysis result
 */
export const calculateMatchScore = (resumeData, jobKeywords = [], jobRequirements = {}) => {
  const analysis = {
    overallScore: 0,
    matchedKeywords: [],
    missingKeywords: [],
    skillsMatch: 0,
    experienceMatch: 0,
    educationMatch: 0,
    suggestions: [],
    breakdown: {}
  };

  // Combine all resume text for analysis
  const allResumeKeywords = [
    ...resumeData.skills,
    ...resumeData.keywords,
    ...(resumeData.experience.jobTitles || []),
    ...(resumeData.education.degrees || []),
    ...(resumeData.education.fields || [])
  ].map(keyword => keyword.toLowerCase());

  // 1. Keyword Matching Analysis (40% weight)
  const keywordAnalysis = analyzeKeywords(allResumeKeywords, jobKeywords);
  analysis.matchedKeywords = keywordAnalysis.matched;
  analysis.missingKeywords = keywordAnalysis.missing;
  analysis.breakdown.keywordScore = keywordAnalysis.score;

  // 2. Skills Analysis (35% weight)
  const skillsAnalysis = analyzeSkills(resumeData.skills, jobRequirements.requiredSkills || []);
  analysis.skillsMatch = skillsAnalysis.score;
  analysis.breakdown.skillsScore = skillsAnalysis.score;

  // 3. Experience Analysis (15% weight)
  const experienceAnalysis = analyzeExperience(resumeData.experience, jobRequirements.minExperience || 0);
  analysis.experienceMatch = experienceAnalysis.score;
  analysis.breakdown.experienceScore = experienceAnalysis.score;

  // 4. Education Analysis (10% weight)
  const educationAnalysis = analyzeEducation(resumeData.education, jobRequirements.education || {});
  analysis.educationMatch = educationAnalysis.score;
  analysis.breakdown.educationScore = educationAnalysis.score;

  // Calculate weighted overall score
  analysis.overallScore = Math.round(
    (analysis.breakdown.keywordScore * 0.4) +
    (analysis.breakdown.skillsScore * 0.35) +
    (analysis.breakdown.experienceScore * 0.15) +
    (analysis.breakdown.educationScore * 0.1)
  );

  // Generate suggestions
  analysis.suggestions = generateSuggestions(analysis, jobRequirements);

  return analysis;
};

/**
 * Analyze keyword matches
 */
const analyzeKeywords = (resumeKeywords, jobKeywords) => {
  const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase());
  const matched = [];
  const missing = [];

  jobKeywordsLower.forEach(jobKeyword => {
    const isFound = resumeKeywords.some(resumeKeyword => 
      resumeKeyword.includes(jobKeyword) || jobKeyword.includes(resumeKeyword)
    );
    
    if (isFound) {
      matched.push(jobKeyword);
    } else {
      missing.push(jobKeyword);
    }
  });

  const score = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;

  return { matched, missing, score };
};

/**
 * Analyze technical skills match
 */
const analyzeSkills = (resumeSkills, requiredSkills) => {
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  
  let matchedCount = 0;
  
  requiredSkillsLower.forEach(requiredSkill => {
    const isFound = resumeSkillsLower.some(resumeSkill => 
      resumeSkill.includes(requiredSkill) || requiredSkill.includes(resumeSkill)
    );
    if (isFound) matchedCount++;
  });

  const score = requiredSkills.length > 0 ? Math.round((matchedCount / requiredSkills.length) * 100) : 0;
  
  return { score, matchedCount, totalRequired: requiredSkills.length };
};

/**
 * Analyze experience level
 */
const analyzeExperience = (resumeExperience, minRequiredYears) => {
  // Extract years of experience from resume text
  const experienceIndicators = resumeExperience.experienceIndicators || [];
  let estimatedYears = 0;

  experienceIndicators.forEach(indicator => {
    const match = indicator.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (indicator.toLowerCase().includes('year')) {
        estimatedYears = Math.max(estimatedYears, num);
      } else if (indicator.toLowerCase().includes('month')) {
        estimatedYears = Math.max(estimatedYears, Math.floor(num / 12));
      }
    }
  });

  // If no explicit experience found, estimate based on job titles
  if (estimatedYears === 0 && resumeExperience.jobTitles.length > 0) {
    const seniorTitles = ['senior', 'lead', 'principal', 'architect', 'manager', 'director'];
    const hasSeniorTitle = resumeExperience.jobTitles.some(title => 
      seniorTitles.some(senior => title.toLowerCase().includes(senior))
    );
    estimatedYears = hasSeniorTitle ? 5 : 2; // Rough estimate
  }

  let score = 0;
  if (minRequiredYears === 0) {
    score = 100; // No experience required
  } else if (estimatedYears >= minRequiredYears) {
    score = 100;
  } else {
    score = Math.round((estimatedYears / minRequiredYears) * 100);
  }

  return { score, estimatedYears, required: minRequiredYears };
};

/**
 * Analyze education requirements
 */
const analyzeEducation = (resumeEducation, requiredEducation) => {
  let score = 50; // Base score if no specific requirements

  if (!requiredEducation.level && !requiredEducation.field) {
    return { score: 100 }; // No education requirements
  }

  // Check degree level
  if (requiredEducation.level) {
    const requiredLevel = requiredEducation.level.toLowerCase();
    const hasDegree = resumeEducation.degrees.some(degree => 
      degree.toLowerCase().includes(requiredLevel)
    );
    if (hasDegree) score += 25;
  }

  // Check field of study
  if (requiredEducation.field) {
    const requiredField = requiredEducation.field.toLowerCase();
    const hasField = resumeEducation.fields.some(field => 
      field.toLowerCase().includes(requiredField) || requiredField.includes(field.toLowerCase())
    );
    if (hasField) score += 25;
  }

  return { score: Math.min(score, 100) };
};

/**
 * Generate improvement suggestions
 */
const generateSuggestions = (analysis, jobRequirements) => {
  const suggestions = [];

  // Keyword suggestions
  if (analysis.missingKeywords.length > 0) {
    suggestions.push(`Add these keywords to your resume: ${analysis.missingKeywords.slice(0, 5).join(', ')}`);
  }

  // Skills suggestions
  if (analysis.breakdown.skillsScore < 70) {
    suggestions.push("Highlight more relevant technical skills and certifications");
  }

  // Experience suggestions
  if (analysis.breakdown.experienceScore < 70) {
    suggestions.push("Provide more specific details about your work experience and achievements");
  }

  // Education suggestions
  if (analysis.breakdown.educationScore < 70 && jobRequirements.education) {
    suggestions.push("Consider highlighting relevant coursework or certifications");
  }

  // Overall suggestions
  if (analysis.overallScore < 60) {
    suggestions.push("Consider tailoring your resume more closely to this job posting");
  }

  return suggestions;
};

/**
 * Extract keywords from job description
 * @param {string} jobDescription - Job description text
 * @returns {Array} - Array of important keywords
 */
export const extractJobKeywords = (jobDescription) => {
  if (!jobDescription) return [];

  const text = jobDescription.toLowerCase();
  
  // Common technical keywords to look for
  const technicalTerms = [
    'javascript', 'python', 'java', 'react', 'node.js', 'express', 'mongodb', 'mysql',
    'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'html', 'css', 'typescript',
    'angular', 'vue', 'django', 'flask', 'spring', 'laravel', 'postgresql', 'redis',
    'microservices', 'api', 'rest', 'graphql', 'ci/cd', 'devops', 'cloud', 'azure', 'gcp'
  ];

  const foundKeywords = technicalTerms.filter(term => text.includes(term));

  // Also extract words that appear multiple times
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  const wordCount = {};
  
  words.forEach(word => {
    if (!['and', 'the', 'for', 'are', 'with', 'you', 'this', 'that', 'will', 'have', 'can', 'our', 'all', 'any', 'may', 'new', 'use', 'get', 'way', 'out', 'one', 'now', 'how', 'its', 'who', 'oil', 'sit', 'but', 'not', 'had', 'see', 'him', 'two', 'she', 'has', 'was'].includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  // Add frequently mentioned words (appears 2+ times)
  const frequentWords = Object.keys(wordCount)
    .filter(word => wordCount[word] >= 2)
    .slice(0, 10);

  return [...new Set([...foundKeywords, ...frequentWords])];
};