import { create } from "zustand";

const defaultResume = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const useResumeStore = create((set) => ({
  resume: defaultResume,

  // ── Personal ────────────────────────────────────────────────────────────────
  setPersonal: (data) =>
    set((state) => ({
      resume: { ...state.resume, personal: { ...state.resume.personal, ...data } },
    })),

  // ── Summary ─────────────────────────────────────────────────────────────────
  setSummary: (summary) =>
    set((state) => ({ resume: { ...state.resume, summary } })),

  // ── Experience ──────────────────────────────────────────────────────────────
  addExperience: (entry) =>
    set((state) => ({
      resume: { ...state.resume, experience: [...state.resume.experience, entry] },
    })),
  setExperience: (experience) =>
    set((state) => ({ resume: { ...state.resume, experience } })),

  // ── Education ───────────────────────────────────────────────────────────────
  addEducation: (entry) =>
    set((state) => ({
      resume: { ...state.resume, education: [...state.resume.education, entry] },
    })),
  setEducation: (education) =>
    set((state) => ({ resume: { ...state.resume, education } })),

  // ── Skills ──────────────────────────────────────────────────────────────────
  setSkills: (skills) =>
    set((state) => ({ resume: { ...state.resume, skills } })),

  // ── Projects ─────────────────────────────────────────────────────────────────
  addProject: (entry) =>
    set((state) => ({
      resume: { ...state.resume, projects: [...state.resume.projects, entry] },
    })),
  setProjects: (projects) =>
    set((state) => ({ resume: { ...state.resume, projects } })),

  // ── Reset ────────────────────────────────────────────────────────────────────
  resetResume: () => set({ resume: defaultResume }),
}));

export default useResumeStore;
