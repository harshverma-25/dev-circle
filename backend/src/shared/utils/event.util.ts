import { EventEmitter } from "events";

class AppEventEmitter extends EventEmitter {}

export const appEvents = new AppEventEmitter();

// Simulating email notifications to satisfy notification event requirements
appEvents.on("interview:scheduled", (data) => {
  console.log(
    `[Event: interview:scheduled] Email notification sent to Candidate (${data.candidateEmail}) and Recruiter (${data.recruiterEmail}) for Interview ID: ${data.interviewId}. Date: ${data.date}, Start Time: ${data.startTime}`
  );
});

appEvents.on("interview:rescheduled", (data) => {
  console.log(
    `[Event: interview:rescheduled] Email notification sent to Candidate (${data.candidateEmail}) and Recruiter (${data.recruiterEmail}) for Interview ID: ${data.interviewId}. New Date: ${data.date}, New Start Time: ${data.startTime}`
  );
});

appEvents.on("interview:cancelled", (data) => {
  console.log(
    `[Event: interview:cancelled] Email notification sent to Candidate (${data.candidateEmail}) and Recruiter (${data.recruiterEmail}) for Interview ID: ${data.interviewId} stating the cancellation.`
  );
});

appEvents.on("interview:completed", (data) => {
  console.log(
    `[Event: interview:completed] Email notification/status update sent to Candidate (${data.candidateEmail}) and Recruiter (${data.recruiterEmail}) for Interview ID: ${data.interviewId}.`
  );
});
