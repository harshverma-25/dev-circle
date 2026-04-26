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
