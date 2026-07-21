import { env } from "../../../config/env.js";

export interface IEmailTemplateData {
  verificationLink?: string;
  name?: string;
  role?: string;
  companyName?: string;
  jobTitle?: string;
  candidateName?: string;
  applicationStatus?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  inviteLink?: string;
}

export const getEmailHTML = (type: string, data: IEmailTemplateData): { subject: string; html: string } => {
  const brandColor = "#6366f1"; // Indigo
  const baseTemplate = (subject: string, content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #1f2937;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #e5e7eb;
          }
          .header {
            background-color: ${brandColor};
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
          }
          .content p {
            margin: 0 0 20px;
            font-size: 16px;
            color: #4b5563;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            background-color: ${brandColor};
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .highlight {
            font-weight: bold;
            color: #111827;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DevCircle</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DevCircle. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  switch (type) {
    case "verification": {
      const subject = "Verify your email address - DevCircle";
      const content = `
        <p>Hello ${data.name || "there"},</p>
        <p>Thank you for registering at DevCircle. Please verify your email address by clicking the button below:</p>
        <div class="button-container">
          <a href="${data.verificationLink}" class="button" style="color: #ffffff;">Verify Email Address</a>
        </div>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "welcome": {
      const subject = "Welcome to DevCircle!";
      const content = `
        <p>Hello ${data.name || "there"},</p>
        <p>Welcome to DevCircle! We are thrilled to have you join our developer hiring and career community.</p>
        <p>Your account is now fully active. Explore opportunities, practice mock interviews, and build your technical profile.</p>
        <div class="button-container">
          <a href="${env.SITE_URL}/dashboard" class="button" style="color: #ffffff;">Get Started</a>
        </div>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "new_application": {
      const subject = `New Application for ${data.jobTitle}`;
      const content = `
        <p>Hello Recruiter,</p>
        <p>A new application has been submitted by <span class="highlight">${data.candidateName}</span> for the role of <span class="highlight">${data.jobTitle}</span>.</p>
        <p>You can review their resume snapshot and profile on your recruitment dashboard.</p>
        <div class="button-container">
          <a href="${env.SITE_URL}/recruiter/applications" class="button" style="color: #ffffff;">Review Application</a>
        </div>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "application_submitted": {
      const subject = `Application Received: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>Your application for the role of <span class="highlight">${data.jobTitle}</span> at <span class="highlight">${data.companyName}</span> has been successfully submitted.</p>
        <p>We have saved your resume snapshot and profile. The recruitment team will review your application soon.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "application_status_updated": {
      const subject = `Application Status Update: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>The status of your application for <span class="highlight">${data.jobTitle}</span> at <span class="highlight">${data.companyName}</span> has been updated to <span class="highlight">${data.applicationStatus}</span>.</p>
        <p>Please log in to your dashboard to view the next steps.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "job_closed": {
      const subject = `Job Application Update: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>Thank you for applying to the <span class="highlight">${data.jobTitle}</span> role at <span class="highlight">${data.companyName}</span>.</p>
        <p>We wanted to let you know that the job opening has been closed. We appreciate your interest in the position and encourage you to apply for future openings.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "interview_scheduled": {
      const subject = `Interview Scheduled: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>An interview has been scheduled for your application for <span class="highlight">${data.jobTitle}</span>.</p>
        <p><span class="highlight">Date:</span> ${data.interviewDate}<br/>
        <span class="highlight">Time:</span> ${data.interviewTime}</p>
        ${data.interviewLink ? `
        <div class="button-container">
          <a href="${data.interviewLink}" class="button" style="color: #ffffff;">Join Interview Meeting</a>
        </div>` : ""}
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "interview_cancelled": {
      const subject = `Interview Cancelled: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>We want to inform you that your scheduled interview for <span class="highlight">${data.jobTitle}</span> has been cancelled.</p>
        <p>If this was unexpected, please contact the recruiter for rescheduling options.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "interview_completed": {
      const subject = `Interview Completed: ${data.jobTitle}`;
      const content = `
        <p>Hello ${data.candidateName},</p>
        <p>Thank you for completing your interview for <span class="highlight">${data.jobTitle}</span>.</p>
        <p>The recruitment team will compile their feedback and notify you of the next steps.</p>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    case "recruiter_invited": {
      const subject = "Invitation to Join Company - DevCircle";
      const content = `
        <p>Hello,</p>
        <p>You have been invited to join <span class="highlight">${data.companyName}</span> as a recruiter on DevCircle.</p>
        <p>Please register or sign in to accept the invitation and begin recruiting.</p>
        <div class="button-container">
          <a href="${data.inviteLink || (env.SITE_URL)}" class="button" style="color: #ffffff;">Join Company</a>
        </div>
      `;
      return { subject, html: baseTemplate(subject, content) };
    }

    default:
      return {
        subject: "Notification from DevCircle",
        html: baseTemplate("Notification from DevCircle", `<p>You have received a new notification.</p>`)
      };
  }
};
