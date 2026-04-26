import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  interviews: ["interviews"],
  interview: (id) => ["interview", id],
};

// ─── Fetchers ────────────────────────────────────────────────────────────────

const fetchInterviews = async () => {
  const { data } = await api.get("/api/interview/list");
  return data.interviews;
};

const applyToInterview = async (interviewId) => {
  const { data } = await api.post(`/api/interview/apply/${interviewId}`);
  return data;
};

const createInterview = async (payload) => {
  const { data } = await api.post("/api/interview/create", payload);
  return data.interview;
};

const joinInterview = async (interviewId) => {
  const { data } = await api.get(`/api/interview/join/${interviewId}`);
  return data; // { success, token, roomName, url }
};

const startInterview = async (interviewId) => {
  const { data } = await api.post(`/api/interview/start/${interviewId}`);
  return data.interview;
};

// ─── Fetch Single Interview ─────────────────────────────────────────────

const fetchInterview = async (interviewId) => {
  const { data } = await api.get(`/api/interview/${interviewId}`);
  return data.interview;
};

/**
 * Fetch single interview details (used in room page)
 */
export function useInterview(interviewId) {
  return useQuery({
    queryKey: QUERY_KEYS.interview(interviewId),
    queryFn: () => fetchInterview(interviewId),
    enabled: !!interviewId, // prevents unnecessary calls
  });
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch all available interviews.
 */
export function useInterviews() {
  return useQuery({
    queryKey: QUERY_KEYS.interviews,
    queryFn: fetchInterviews,
  });
}

/**
 * Apply to a specific interview session.
 * Automatically invalidates the interviews list after success.
 */
export function useApplyInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyToInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews });
    },
  });
}

/**
 * Create a new interview session (host flow).
 * Automatically invalidates the interviews list after success.
 */
export function useCreateInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interviews });
    },
    onError: (error) => {
      console.error("[useCreateInterview] Error:", error.response?.data || error.message);
    },
  });
}

/**
 * Fetch LiveKit token + URL for a specific interview room.
 * Changed to useMutation so the token is ONLY generated when the user clicks 'Join',
 * rather than automatically on page load.
 */
export function useJoinInterview() {
  return useMutation({
    mutationFn: joinInterview,
  });
}

/**
 * Start an interview (host only).
 * Automatically invalidates the interview query after success.
 */
export function useStartInterview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startInterview,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.interview(id) });
    },
  });
}
