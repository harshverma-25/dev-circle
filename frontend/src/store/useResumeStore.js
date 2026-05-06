import { create } from "zustand";

const newId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const defaultResume = {
  personal: {
    fullName: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  skills: {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    tools: [],
  },
  experience: [],
  education: [],
  projects: [],
  achievements: [],
};

const useResumeStore = create((set) => ({
  resume: defaultResume,

  // ── Personal ──────────────────────────────────────────────────────────────
  setPersonal: (data) =>
    set((s) => ({
      resume: { ...s.resume, personal: { ...s.resume.personal, ...data } },
    })),

  // ── Summary ───────────────────────────────────────────────────────────────
  setSummary: (summary) =>
    set((s) => ({ resume: { ...s.resume, summary } })),

  // ── Skills ────────────────────────────────────────────────────────────────
  setSkillCategory: (category, skills) =>
    set((s) => ({
      resume: {
        ...s.resume,
        skills: { ...s.resume.skills, [category]: skills },
      },
    })),

  // ── Experience ────────────────────────────────────────────────────────────
  addExperience: () =>
    set((s) => ({
      resume: {
        ...s.resume,
        experience: [
          ...s.resume.experience,
          { id: newId(), company: "", role: "", duration: "", location: "", bullets: [] },
        ],
      },
    })),
  updateExperience: (id, data) =>
    set((s) => ({
      resume: {
        ...s.resume,
        experience: s.resume.experience.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),
  removeExperience: (id) =>
    set((s) => ({
      resume: {
        ...s.resume,
        experience: s.resume.experience.filter((e) => e.id !== id),
      },
    })),

  // ── Education ─────────────────────────────────────────────────────────────
  addEducation: () =>
    set((s) => ({
      resume: {
        ...s.resume,
        education: [
          ...s.resume.education,
          { id: newId(), institution: "", degree: "", duration: "", grade: "" },
        ],
      },
    })),
  updateEducation: (id, data) =>
    set((s) => ({
      resume: {
        ...s.resume,
        education: s.resume.education.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),
  removeEducation: (id) =>
    set((s) => ({
      resume: {
        ...s.resume,
        education: s.resume.education.filter((e) => e.id !== id),
      },
    })),

  // ── Projects ──────────────────────────────────────────────────────────────
  addProject: () =>
    set((s) => ({
      resume: {
        ...s.resume,
        projects: [
          ...s.resume.projects,
          { id: newId(), title: "", techStack: "", liveLink: "", githubLink: "", bullets: [] },
        ],
      },
    })),
  updateProject: (id, data) =>
    set((s) => ({
      resume: {
        ...s.resume,
        projects: s.resume.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
      },
    })),
  removeProject: (id) =>
    set((s) => ({
      resume: {
        ...s.resume,
        projects: s.resume.projects.filter((p) => p.id !== id),
      },
    })),

  // ── Achievements ──────────────────────────────────────────────────────────
  addAchievement: () =>
    set((s) => ({
      resume: {
        ...s.resume,
        achievements: [
          ...s.resume.achievements,
          { id: newId(), title: "", description: "", link: "" },
        ],
      },
    })),
  updateAchievement: (id, data) =>
    set((s) => ({
      resume: {
        ...s.resume,
        achievements: s.resume.achievements.map((a) =>
          a.id === id ? { ...a, ...data } : a
        ),
      },
    })),
  removeAchievement: (id) =>
    set((s) => ({
      resume: {
        ...s.resume,
        achievements: s.resume.achievements.filter((a) => a.id !== id),
      },
    })),

  // ── Reset ─────────────────────────────────────────────────────────────────
  resetResume: () => set({ resume: defaultResume }),
}));

export default useResumeStore;
