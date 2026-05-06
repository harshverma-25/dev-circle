"use client";

import { FiDownload, FiEye, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiGlobe } from "react-icons/fi";
import useResumeStore from "../../store/useResumeStore";

/* ── Content Components ─────────────────────────────────────────────────── */

function SectionHeader({ title }) {
  return (
    <h3 className="text-[13px] font-bold text-zinc-900 border-b border-zinc-200 pb-1 mb-2 uppercase tracking-wider">
      {title}
    </h3>
  );
}

/* ── Skeleton primitives (fallback) ───────────────────────────────────────── */

function SkeletonLine({ width = "100%", height = "h-3", className = "" }) {
  return (
    <div
      className={`${height} rounded-full bg-zinc-100 animate-pulse ${className}`}
      style={{ width }}
    />
  );
}

/* ── A4 Resume Preview ───────────────────────────────────────────────────── */

function A4ResumePreview() {
  const resume = useResumeStore((state) => state.resume);

  const hasPersonal = resume.personal.fullName || resume.personal.role;
  const hasSummary = resume.summary.trim().length > 0;
  const hasExperience = resume.experience.length > 0;
  const hasEducation = resume.education.length > 0;
  const hasSkills = Object.values(resume.skills).some(cat => cat.length > 0);
  const hasProjects = resume.projects.length > 0;
  const hasAchievements = resume.achievements.length > 0;

  return (
    <div
      id="a4-resume-preview"
      className="w-full bg-white text-zinc-800 shadow-2xl rounded-sm overflow-hidden text-[11px] leading-relaxed"
      style={{ aspectRatio: "1 / 1.414", fontFamily: "var(--font-inter)" }}
    >
      <div className="p-10 h-full flex flex-col gap-6 overflow-y-auto print:p-0">

        {/* ── Header ── */}
        <header className="text-center space-y-2 border-b border-zinc-100 pb-6">
          {resume.personal.fullName ? (
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              {resume.personal.fullName}
            </h1>
          ) : (
            <SkeletonLine width="50%" height="h-8" className="mx-auto" />
          )}

          {resume.personal.role ? (
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
              {resume.personal.role}
            </p>
          ) : (
            <SkeletonLine width="30%" height="h-4" className="mx-auto" />
          )}

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-zinc-500 mt-3">
            {resume.personal.email && (
              <span className="flex items-center gap-1"><FiMail className="text-[10px]" /> {resume.personal.email}</span>
            )}
            {resume.personal.phone && (
              <span className="flex items-center gap-1"><FiPhone className="text-[10px]" /> {resume.personal.phone}</span>
            )}
            {resume.personal.location && (
              <span className="flex items-center gap-1"><FiMapPin className="text-[10px]" /> {resume.personal.location}</span>
            )}
            {resume.personal.linkedin && (
              <span className="flex items-center gap-1"><FiLinkedin className="text-[10px]" /> {resume.personal.linkedin.replace(/^https?:\/\//, '')}</span>
            )}
            {resume.personal.github && (
              <span className="flex items-center gap-1"><FiGithub className="text-[10px]" /> {resume.personal.github.replace(/^https?:\/\//, '')}</span>
            )}
            {resume.personal.portfolio && (
              <span className="flex items-center gap-1"><FiGlobe className="text-[10px]" /> {resume.personal.portfolio.replace(/^https?:\/\//, '')}</span>
            )}
            {!hasPersonal && (
              <div className="flex gap-3">
                <SkeletonLine width="80px" height="h-2.5" />
                <SkeletonLine width="100px" height="h-2.5" />
                <SkeletonLine width="90px" height="h-2.5" />
              </div>
            )}
          </div>
        </header>

        {/* ── Summary ── */}
        {(hasSummary || !hasPersonal) && (
          <section>
            <SectionHeader title="Professional Summary" />
            {hasSummary ? (
              <p className="whitespace-pre-wrap text-zinc-700">{resume.summary}</p>
            ) : (
              <div className="space-y-2">
                <SkeletonLine width="100%" />
                <SkeletonLine width="95%" />
                <SkeletonLine width="40%" />
              </div>
            )}
          </section>
        )}

        {/* ── Experience ── */}
        {(hasExperience || !hasPersonal) && (
          <section>
            <SectionHeader title="Work Experience" />
            <div className="space-y-4">
              {hasExperience ? (
                resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between font-bold text-zinc-900">
                      <span className="text-sm">{exp.role}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{exp.duration}</span>
                    </div>
                    <div className="flex items-baseline justify-between text-zinc-600 italic">
                      <span>{exp.company}</span>
                      <span className="text-[10px]">{exp.location}</span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 mt-1 pl-1 text-zinc-700">
                        {exp.bullets.map((b, i) => b && <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between"><SkeletonLine width="40%" height="h-3" /><SkeletonLine width="20%" height="h-2" /></div>
                      <SkeletonLine width="30%" height="h-2" />
                      <SkeletonLine width="90%" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        {(hasSkills || !hasPersonal) && (
          <section>
            <SectionHeader title="Technical Skills" />
            {hasSkills ? (
              <div className="space-y-1.5">
                {Object.entries(resume.skills).map(([key, list]) => (
                  list.length > 0 && (
                    <div key={key} className="flex gap-2">
                      <span className="font-bold capitalize min-w-[75px]">{key}:</span>
                      <span className="text-zinc-700">{list.join(", ")}</span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonLine key={i} width={`${40 + i * 10}px`} height="h-5" />)}
              </div>
            )}
          </section>
        )}

        {/* ── Projects ── */}
        {(hasProjects || !hasPersonal) && (
          <section>
            <SectionHeader title="Projects" />
            <div className="space-y-3">
              {hasProjects ? (
                resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900">{proj.title}</h4>
                      <span className="text-[10px] text-zinc-400">|</span>
                      <span className="text-[10px] text-zinc-500 italic">{proj.techStack}</span>
                    </div>
                    <div className="flex gap-3 text-[9px] font-medium text-zinc-400 mb-1">
                      {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="hover:text-[#adc6ff] underline underline-offset-2">Live Demo</a>}
                      {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:text-[#adc6ff] underline underline-offset-2">GitHub</a>}
                    </div>
                    {proj.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-zinc-700">
                        {proj.bullets.map((b, i) => b && <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                   <SkeletonLine width="25%" height="h-3" />
                   <SkeletonLine width="95%" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Education ── */}
        {(hasEducation || !hasPersonal) && (
          <section>
            <SectionHeader title="Education" />
            <div className="space-y-3">
              {hasEducation ? (
                resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-zinc-900">{edu.institution}</div>
                      <div className="text-zinc-600">{edu.degree}</div>
                      {edu.grade && <div className="text-[10px] text-zinc-500">Grade: {edu.grade}</div>}
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500 pt-0.5">{edu.duration}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between"><SkeletonLine width="35%" /><SkeletonLine width="15%" /></div>
              )}
            </div>
          </section>
        )}

         {/* ── Achievements ── */}
         {hasAchievements && (
          <section>
            <SectionHeader title="Achievements" />
            <ul className="list-disc list-inside space-y-1.5 text-zinc-700">
              {resume.achievements.map((ach) => (
                <li key={ach.id}>
                  <span className="font-bold text-zinc-800">{ach.title}:</span> {ach.description}
                  {ach.link && <a href={ach.link} className="ml-2 text-zinc-400 hover:text-zinc-600 underline">Link</a>}
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}

/* ── Panel ───────────────────────────────────────────────────────────────── */

export default function ResumePreviewPanel() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="resume-preview-panel"
      aria-label="Live resume preview"
      className="
        relative flex flex-col
        bg-[#1a1a24]
        /* dot grid background */
        [background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:22px_22px]
        /* sticky on desktop */
        lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        print:bg-white print:h-auto print:overflow-visible print:p-0 print:block
      "
    >
      {/* Panel top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#1a1a24]/90 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-2 text-zinc-400">
          <FiEye className="text-sm" />
          <span className="text-xs font-medium tracking-wide uppercase">Live Preview</span>
        </div>

        <button
          id="btn-preview-download"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs hover:text-white hover:border-white/20 transition-all cursor-pointer"
        >
          <FiDownload className="text-xs" />
          Print / PDF
        </button>
      </div>

      {/* A4 paper — centered with padding */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-10 print:p-0 print:block">
        <div className="w-full max-w-[680px] print:max-w-none shadow-md print:shadow-none">
          <A4ResumePreview />
        </div>
      </div>
    </section>
  );
}
