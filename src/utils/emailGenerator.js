/**
 * AI Email Writer Assistant - Local Generator Engine
 * Generates realistic, context-aware personalized emails based on user inputs.
 */

// Preset Examples for 1-click prompt loading
export const EXAMPLE_PROMPTS = [
  {
    title: "Leave request to professor",
    label: "Write a leave request to my professor",
    icon: "GraduationCap",
    recipient: "Professor",
    purpose: "Leave Request",
    tone: "Formal",
    details: "I need to request 3 days of leave (next Monday to Wednesday) due to a family medical emergency. I will catch up on lecture notes and submit my assignment on time.",
  },
  {
    title: "Job application to HR",
    label: "Write a professional job application email",
    icon: "Briefcase",
    recipient: "HR",
    purpose: "Job Application",
    tone: "Professional",
    details: "Applying for the Senior Frontend Engineer position. I have over 5 years of experience in React, TypeScript, and web application design. Attached is my resume.",
  },
  {
    title: "Meeting request to manager",
    label: "Write a meeting request to my manager",
    icon: "Calendar",
    recipient: "Manager",
    purpose: "Meeting Request",
    tone: "Professional",
    details: "Would like to request a 30-minute sync next Tuesday or Wednesday to discuss Q4 performance review goals, project priorities, and team resources.",
  },
  {
    title: "Thank you note to client",
    label: "Write a thank you note to a client",
    icon: "HeartHandshake",
    recipient: "Client",
    purpose: "Thank You",
    tone: "Friendly",
    details: "Thanking them for finalizing our contract for the upcoming software migration project. Excited to partner together and kick off next week.",
  },
  {
    title: "Follow-up after interview",
    label: "Write a follow-up email to HR",
    icon: "Send",
    recipient: "HR",
    purpose: "Follow-up",
    tone: "Professional",
    details: "Following up on my interview last Thursday for the Product Designer role. Reiterating my strong interest in joining the team and inquiring about next steps.",
  },
  {
    title: "Permission request for lab work",
    label: "Write a permission request to professor",
    icon: "KeyRound",
    recipient: "Professor",
    purpose: "Permission Request",
    tone: "Formal",
    details: "Requesting permission to access the computer lab after hours this weekend to complete data processing for my thesis project.",
  },
];

// Helper to format salutations with proper capitalization and tone/recipient matching
function formatName(rawName) {
  if (!rawName) return "";
  let name = rawName.trim();
  if (!name) return "";

  // Normalize missing space after title period (e.g. "mr.andrew" -> "mr. andrew", "dr.smith" -> "dr. smith")
  name = name.replace(/^(mr|ms|mrs|dr|prof)\.([a-zA-Z])/i, '$1. $2');

  return name
    .split(/\s+/)
    .map(word => {
      if (!word) return "";
      const lower = word.toLowerCase();
      if (lower === 'mr.') return 'Mr.';
      if (lower === 'ms.') return 'Ms.';
      if (lower === 'mrs.') return 'Mrs.';
      if (lower === 'dr.') return 'Dr.';
      if (lower === 'prof.') return 'Prof.';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function getSalutation(recipient, tone, recipientName) {
  const formattedName = formatName(recipientName);

  switch (recipient) {
    case "Professor": {
      if (formattedName) {
        let cleanName = formattedName.replace(/^(respected\s+)?(professor|prof\.)\s+/i, '').trim();
        if (!cleanName || cleanName.toLowerCase() === 'professor' || cleanName.toLowerCase() === 'prof.') {
          return tone === "Formal" ? "Respected Professor," : "Dear Professor,";
        }
        if (tone === "Formal") {
          return `Respected Professor ${cleanName},`;
        } else if (tone === "Friendly") {
          return `Hello Professor ${cleanName},`;
        } else {
          return `Dear Professor ${cleanName},`;
        }
      }
      return tone === "Formal" ? "Respected Professor," : tone === "Friendly" ? "Hello Professor," : "Dear Professor,";
    }

    case "HR": {
      if (tone === "Formal") {
        return "Dear Hiring Manager,";
      }
      if (formattedName) {
        return tone === "Friendly" ? `Hi ${formattedName},` : `Dear ${formattedName},`;
      }
      return tone === "Friendly" ? "Hi HR Team," : "Dear Hiring Manager,";
    }

    case "Manager": {
      if (tone === "Formal") {
        if (formattedName) {
          const hasTitle = /^(mr\.|ms\.|mrs\.|dr\.|prof\.)/i.test(formattedName);
          return hasTitle ? `Dear ${formattedName},` : `Dear Mr./Ms. ${formattedName},`;
        }
        return "Dear Manager,";
      } else if (tone === "Friendly") {
        return formattedName ? `Hi ${formattedName},` : "Hello Manager,";
      } else {
        return formattedName ? `Hello ${formattedName},` : "Dear Manager,";
      }
    }

    case "Client": {
      if (tone === "Formal") {
        if (formattedName) {
          const hasTitle = /^(mr\.|ms\.|mrs\.|dr\.|prof\.)/i.test(formattedName);
          return hasTitle ? `Dear ${formattedName},` : `Dear Mr./Ms. ${formattedName},`;
        }
        return "Dear Client,";
      } else if (tone === "Friendly") {
        return formattedName ? `Hi ${formattedName},` : "Hi Valued Client,";
      } else {
        return formattedName ? `Hello ${formattedName},` : "Dear Client,";
      }
    }

    case "Friend": {
      if (formattedName) {
        return `Hi ${formattedName},`;
      }
      return tone === "Friendly" ? "Hi there," : "Hello,";
    }

    default: {
      if (formattedName) {
        if (tone === "Formal") {
          const hasTitle = /^(mr\.|ms\.|mrs\.|dr\.|prof\.)/i.test(formattedName);
          return hasTitle ? `Dear ${formattedName},` : `Dear Mr./Ms. ${formattedName},`;
        }
        if (tone === "Friendly") return `Hi ${formattedName},`;
        return `Dear ${formattedName},`;
      }
      if (tone === "Formal") return "To Whom It May Concern,";
      if (tone === "Friendly") return "Hello,";
      return "Dear Sir/Madam,";
    }
  }
}

// Helper to format sign-offs
function getSignoff(recipient, tone, senderName) {
  const name = senderName?.trim() || "[Your Name]";
  let signoffWord = "Best regards,";

  if (tone === "Formal") {
    signoffWord = recipient === "Professor" ? "Respectfully yours," : "Sincerely,";
  } else if (tone === "Friendly") {
    signoffWord = "Warm regards," || "Best,";
  } else if (tone === "Concise") {
    signoffWord = "Best,";
  } else {
    signoffWord = "Best regards,";
  }

  return `${signoffWord}\n${name}`;
}

// Core detail cleaner and enhancer
function cleanDetails(details) {
  if (!details || !details.trim()) return "";
  let trimmed = details.trim();
  // Ensure basic sentence ending
  if (!/[.!?]$/.test(trimmed)) {
    trimmed += ".";
  }
  return trimmed;
}

/**
 * Main Email Generator Function
 */
export function generateEmail({
  recipient = "Manager",
  purpose = "Leave Request",
  tone = "Professional",
  details = "",
  senderName = "",
  recipientName = "",
  variationIndex = 0,
}) {
  const userDetails = cleanDetails(details);
  const salutation = getSalutation(recipient, tone, recipientName);
  const signoff = getSignoff(recipient, tone, senderName);

  // Subject line generation algorithms
  let subject = generateSubject(purpose, recipient, tone, userDetails, variationIndex);
  
  // Body generation algorithms
  let body = generateBody(purpose, recipient, tone, userDetails, salutation, signoff, variationIndex);

  return {
    subject,
    body,
    meta: {
      recipient,
      purpose,
      tone,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wordCount: body.split(/\s+/).filter(Boolean).length,
    }
  };
}

// Subject Line Generator Matrix
function generateSubject(purpose, recipient, tone, userDetails, index) {
  const detailSnippet = extractSnippet(userDetails);
  const varKey = index % 3;

  switch (purpose) {
    case "Leave Request":
      if (varKey === 0) return detailSnippet ? `Leave Request: ${detailSnippet}` : `Request for Leave of Absence - [Your Name]`;
      if (varKey === 1) return `Leave Application | [Your Name]`;
      return `Absence Request & Work Coverage Plan`;

    case "Job Application":
      if (varKey === 0) return detailSnippet ? `Application for ${detailSnippet}` : `Application for Position - [Your Name]`;
      if (varKey === 1) return `Job Application: [Position Title] - [Your Name]`;
      return `Enthusiastic Applicant for [Position Title] - [Your Name]`;

    case "Meeting Request":
      if (varKey === 0) return detailSnippet ? `Meeting Request: ${detailSnippet}` : `Request for a Brief Meeting - [Your Name]`;
      if (varKey === 1) return `Scheduling Request: Synchronization on [Topic]`;
      return `Discussion Request & Availability Check`;

    case "Complaint":
      if (varKey === 0) return detailSnippet ? `Urgent Issue: ${detailSnippet}` : `Notice Regarding Recent Issue - [Your Name]`;
      if (varKey === 1) return `Formal Complaint & Resolution Request`;
      return `Attention Needed: Service/Issue Inquiry`;

    case "Thank You":
      if (varKey === 0) return detailSnippet ? `Thank You - ${detailSnippet}` : `Thank You for Your Time & Support`;
      if (varKey === 1) return `Sincere Thanks & Appreciation - [Your Name]`;
      return `Expressing My Gratitude`;

    case "Follow-up":
      if (varKey === 0) return detailSnippet ? `Following Up: ${detailSnippet}` : `Following Up on Our Recent Conversation`;
      if (varKey === 1) return `Status Inquiry & Follow-Up - [Your Name]`;
      return `Checking In: Next Steps & Updates`;

    case "Permission Request":
      if (varKey === 0) return detailSnippet ? `Permission Request: ${detailSnippet}` : `Seeking Approval for Request - [Your Name]`;
      if (varKey === 1) return `Formal Request for Approval`;
      return `Permission & Authorization Inquiry`;

    default:
      if (varKey === 0) return detailSnippet ? `Inquiry Regarding ${detailSnippet}` : `Important Correspondence - [Your Name]`;
      if (varKey === 1) return `Notice & Update - [Your Name]`;
      return `Communication Regarding [Topic]`;
  }
}

// Extract a short concise 3-5 word phrase from user details for subject lines
function extractSnippet(text) {
  if (!text) return "";
  // Simple extraction: remove punctuation, get first 5 words or key terms
  const cleaned = text.replace(/[^\w\s]/gi, '');
  const words = cleaned.split(/\s+/).slice(0, 5).join(' ');
  return words.length > 30 ? words.slice(0, 30) + "..." : words;
}

// Body Generator Matrix with Rich Variations
function generateBody(purpose, recipient, tone, userDetails, salutation, signoff, variationIndex) {
  const v = variationIndex % 3;
  let bodyParagraphs = [];

  // Tone descriptors & openers
  const toneStyle = {
    Professional: {
      intro: "I am writing to formally reach out regarding",
      transition: "Please let me know if you require any further information.",
      courtesy: "I appreciate your time and consideration.",
    },
    Formal: {
      intro: "I hope this email finds you well. I am submitting this formal request regarding",
      transition: "I remain at your disposal should you require additional documentation or clarification.",
      courtesy: "Thank you for your valuable time and attention to this matter.",
    },
    Friendly: {
      intro: "Hope you're having a great week! I wanted to quickly reach out about",
      transition: "Let me know what works best for you whenever you have a moment.",
      courtesy: "Thanks so much for your support!",
    },
    Concise: {
      intro: "I am writing regarding",
      transition: "Please review and let me know your thoughts.",
      courtesy: "Thanks for your prompt attention.",
    }
  }[tone] || {
    intro: "I am writing to reach out regarding",
    transition: "Please let me know your thoughts.",
    courtesy: "Thank you for your time."
  };

  // Specific Body builders based on Purpose
  switch (purpose) {
    case "Leave Request":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} a temporary leave of absence. ${userDetails || "I am requesting leave due to upcoming personal commitments that require my full attention."}`,
          `During my period of absence, I will ensure that my ongoing tasks are properly covered and handed over. I will also make myself available for urgent queries via email whenever possible.`,
          `Could you please let me know if this leave schedule receives your approval? ${toneStyle.courtesy}`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I am writing to officially request permission to take a leave of absence. ${userDetails || "I need to take time off due to pressing obligations."}`,
          `Prior to my departure, I am prioritizing all critical deliverables to ensure seamless continuity. I will review any missed materials or updates immediately upon my return.`,
          `Thank you for understanding. Please let me know if there are any forms or procedures I should complete.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `Please accept this email as my formal application for leave. ${userDetails || "I will be absent for the requested duration."}`,
          `I have organized my schedule to minimize any impact on our team's workflow and will stay updated on urgent correspondence.`,
          `${toneStyle.courtesy} I look forward to your positive confirmation.`,
          `${signoff}`
        ];
      }
      break;

    case "Job Application":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} the open role at your organization. ${userDetails || "I am eager to express my enthusiasm for contributing to your team with my technical expertise and background."}`,
          `With a strong background in delivering high-impact projects, collaborating across teams, and driving operational excellence, I am confident in my ability to add immediate value to your ongoing goals.`,
          `I have attached my resume for your review. I would welcome the opportunity to discuss how my qualifications align with your team's needs. ${toneStyle.courtesy}`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I am submitting my candidate application with great enthusiasm. ${userDetails || "My experience aligns closely with the objectives of this role."}`,
          `Throughout my career, I have consistently focused on problem-solving, quality execution, and continuous improvement. I am impressed by your team's work and would be thrilled to bring my skills to your projects.`,
          `Thank you for reviewing my profile. I look forward to the possibility of speaking with you during an interview.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `I am writing to express my strong interest in joining your team. ${userDetails || "I believe my skill set makes me a compelling candidate."}`,
          `Enclosed is my resume detailing my academic and professional journey. I am available at your convenience for a phone or video interview.`,
          `${toneStyle.courtesy}`,
          `${signoff}`
        ];
      }
      break;

    case "Meeting Request":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} scheduling a brief meeting with you. ${userDetails || "I would like to dedicate 20-30 minutes to discuss upcoming priorities and align on key decisions."}`,
          `Please let me know a day and time this week that suits your schedule, or feel free to send over a calendar invite at your convenience.`,
          `${toneStyle.courtesy} Looking forward to our conversation.`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I hope your week is going well. I would like to request some time on your calendar to connect. ${userDetails || "The purpose is to review current progress and address open questions."}`,
          `I anticipate this discussion will take approximately 15 to 30 minutes. Let me know if any slots tomorrow or later this week work for you.`,
          `Thank you for your time and flexibility.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `Could we schedule a short sync in the coming days? ${userDetails || "I want to walk you through a brief update and gather your feedback."}`,
          `Please share a few time slots when you are free, and I will gladly send an invite.`,
          `${toneStyle.courtesy}`,
          `${signoff}`
        ];
      }
      break;

    case "Complaint":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} a matter that requires immediate attention and resolution. ${userDetails || "I recently experienced an issue regarding product delivery/service standard that did not meet expectations."}`,
          `I request that this matter be investigated promptly, and that appropriate steps be taken to rectify the situation.`,
          `${toneStyle.transition} ${toneStyle.courtesy}`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I am reaching out to bring an urgent issue to your attention. ${userDetails || "The situation has caused significant inconvenience and requires escalation."}`,
          `I trust you will take the necessary measures to address this promptly and provide an update on how it will be resolved.`,
          `Thank you for your prompt action on this urgent inquiry.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `I am writing to register a formal complaint regarding recent service quality. ${userDetails || "The current outcomes fall short of expected standards."}`,
          `I look forward to hearing from you soon with a proposed resolution or next steps to resolve this.`,
          `${signoff}`
        ];
      }
      break;

    case "Thank You":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} expressing my sincere appreciation. ${userDetails || "Thank you for your guidance, support, and time during our recent interactions."}`,
          `Your insight and assistance were truly valuable, and I am grateful for the positive impact it has made.`,
          `I look forward to staying in touch and collaborating again in the future!`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I wanted to take a moment to express my heartfelt thanks. ${userDetails || "Your assistance was hugely appreciated and made a big difference."}`,
          `Thank you again for your kindness and generosity of time. Please let me know if I can ever return the favor.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `Just a quick note to say thank you! ${userDetails || "I really appreciate your help with this project."}`,
          `Wishing you a fantastic week ahead!`,
          `${signoff}`
        ];
      }
      break;

    case "Follow-up":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} following up on our previous communication. ${userDetails || "I wanted to check in regarding the status of our recent discussion and see if there are any updates."}`,
          `Please let me know if you require any additional details from my end to move things forward.`,
          `${toneStyle.courtesy} I look forward to hearing from you.`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I hope you are having a productive week. I am following up on my previous message. ${userDetails || "I wanted to inquire if any progress has been made or if a decision has been reached."}`,
          `I am happy to provide any further information if helpful.`,
          `Thank you for your time and guidance!`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `Gentle follow-up regarding our earlier conversation. ${userDetails || "Checking in on the next steps."}`,
          `Whenever you have a moment, please share an update. Thanks!`,
          `${signoff}`
        ];
      }
      break;

    case "Permission Request":
      if (v === 0) {
        bodyParagraphs = [
          `${salutation}`,
          `${toneStyle.intro} seeking formal permission for an upcoming activity. ${userDetails || "I am requesting approval to proceed with the planned initiative under standard guidelines."}`,
          `I will adhere strictly to all required protocols and ensure that everything is executed responsibly.`,
          `Please let me know if you grant approval or if adjustments are required. ${toneStyle.courtesy}`,
          `${signoff}`
        ];
      } else if (v === 1) {
        bodyParagraphs = [
          `${salutation}`,
          `I am writing to formally request authorization. ${userDetails || "I would appreciate your permission to proceed as outlined."}`,
          `All necessary precautions and requirements will be maintained throughout.`,
          `Thank you for considering my request. I await your response.`,
          `${signoff}`
        ];
      } else {
        bodyParagraphs = [
          `${salutation}`,
          `Requesting your approval regarding the following: ${userDetails || "Seeking permission to proceed."}`,
          `Please inform me if this is approved at your earliest convenience.`,
          `${signoff}`
        ];
      }
      break;

    default: // Other
      bodyParagraphs = [
        `${salutation}`,
        `${toneStyle.intro} the following details: ${userDetails || "I am reaching out regarding important updates and context."}`,
        `Please feel free to reply with any comments, questions, or next steps.`,
        `${toneStyle.courtesy}`,
        `${signoff}`
      ];
      break;
  }

  return bodyParagraphs.join("\n\n");
}
