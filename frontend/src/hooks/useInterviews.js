import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  interviews:      ["interviews"],
  interview:       (id) => ["interview", id],
  applications:    (id) => ["applications", id],
  myApplication:   (id) => ["my-application", id],
};

// ─── API Fetchers ─────────────────────────────────────────────────────────────

const fetchInterviews = async () => {
  const { data } = await api.get("/api/interview/list");
  return data.interviews;
};

const fetchInterview = async (id) => {
  const { data } = await api.get(`/api/interview/${id}`);
  return data.interview;
};

const fetchApplications = async (interviewId) => {
  const { data } = await api.get(`/api/interview/applications/${interviewId}`);
  return data.applications;
};

const fetchMyApplication = async (interviewId) => {
  const { data } = await api.get(`/api/interview/my-application/${interviewId}`);
  return data.application; // null if not applied
};

const createInterview = async (payload) => {
  const { data } = await api.post("/api/interview/create", payload);
  return data.interview;
};

const applyToInterview = async ({ interviewId, resumeUrl, resumeType, cloudinaryPublicId }) => {
  const { data } = await api.post(`/api/interview/apply/${interviewId}`, {
    resumeUrl,
    resumeType,
    cloudinaryPublicId,
  });
  return data.application;
};

const updateApplicationStatus = async ({ applicationId, status }) => {
  const { data } = await api.patch(
    `/api/interview/applications/${applicationId}/status`,
    { status }
  );
  return data.application;
};

const startInterview = async (interviewId) => {
  const { data } = await api.post(`/api/interview/start/${interviewId}`);
  return data.interview;
};

const joinInterview = async (interviewId) => {
  const { data } = await api.get(`/api/interview/join/${interviewId}`);
  return data; // { success, token, roomName, url }
};

// ─── Upload Resume File ───────────────────────────────────────────────────────

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post("/api/upload/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { success, url, publicId }
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all available interviews (public) */
export function useInterviews() {
  return useQuery({
    queryKey: QUERY_KEYS.interviews,
    queryFn: fetchInterviews,
  });
}

/** Fetch a single interview — polls every 3s until it starts */
export function useInterview(id) {
  return useQuery({
    queryKey: QUERY_KEYS.interview(id),
    queryFn: () => fetchInterview(id),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.isStarted ? false : 3000,
  });
}

/** Fetch all applications for an interview (host only) */
export function useApplications(interviewId) {
  return useQuery({
    queryKey: QUERY_KEYS.applications(interviewId),
    queryFn: () => fetchApplications(interviewId),
    enabled: !!interviewId,
    refetchInterval: 5000, // refresh every 5s so host sees new applicants live
  });
}

/** Check if the current user has applied to this interview */
export function useMyApplication(interviewId) {
  return useQuery({
    queryKey: QUERY_KEYS.myApplication(interviewId),
    queryFn: () => fetchMyApplication(interviewId),
    enabled: !!interviewId,
    refetchInterval: 4000, // poll for status changes (pending → accepted/rejected)
  });
}

/** Create a new interview session */
export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews });
    },
    onError: (err) => {
      console.error("[useCreateInterview]", err.response?.data || err.message);
    },
  });
}

/** Apply to an interview with resume */
export function useApplyInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyToInterview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myApplication(variables.interviewId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews });
    },
  });
}

/** Accept or reject an application (host only) */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (updatedApp) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.applications(updatedApp.interviewId),
      });
    },
  });
}

/** Start an interview (host only) */
export function useStartInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startInterview,
    onSuccess: (interview) => {
      // Correctly invalidate by the interview's _id string
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interview(interview._id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews });
    },
  });
}

/** Get LiveKit token + URL to enter the room */
export function useJoinInterview() {
  return useMutation({
    mutationFn: joinInterview,
  });
}
