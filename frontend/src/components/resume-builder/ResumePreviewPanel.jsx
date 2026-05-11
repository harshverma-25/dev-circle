"use client";

import { FiDownload, FiEye, FiMail, FiPhone, FiLinkedin, FiGithub } from "react-icons/fi";
import { generatePDF } from "../../lib/pdf-utils";
import useResumeStore from "../../store/useResumeStore";

/* ── Section Header — bold text + full underline ─────────────────────────── */
function SectionHeader({ title }) {
  return (
    <div className="mb-1.5 mt-0.5">
      <h3 className="text-[12px] font-bold text-zinc-900 uppercase tracking-wide">{title}</h3>
      <div className="border-b border-zinc-700 mt-0.5" />
    </div>
  );
}

/* ── Skeleton primitives ─────────────────────────────────────────────────── */
function SkeletonLine({ width = "100%", height = "h-2.5", className = "" }) {
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

  const hasPersonal   = resume.personal.fullName || resume.personal.role;
  const hasSummary    = resume.summary.trim().length > 0;
  const hasExperience = resume.experience.length > 0;
  const hasEducation  = resume.education.length > 0;
  const hasSkills     = Object.values(resume.skills).some((cat) => cat.length > 0);
  const hasProjects   = resume.projects.length > 0;
  const hasAchievements = resume.achievements.length > 0;

  // Build a contact line like the image: ✆ phone  ✉ email  in Linkedin  ⌂ Github
  const contactItems = [];
  if (resume.personal.phone)    contactItems.push({ icon: "✆", text: resume.personal.phone });
  if (resume.personal.email)    contactItems.push({ icon: "✉", text: resume.personal.email });
  if (resume.personal.linkedin) contactItems.push({ icon: "in", text: resume.personal.linkedin.replace(/^https?:\/\//, ""), href: resume.personal.linkedin });
  if (resume.personal.github)   contactItems.push({ icon: "⌂", text: resume.personal.github.replace(/^https?:\/\//, ""), href: resume.personal.github });
  if (resume.personal.location) contactItems.push({ icon: "📍", text: resume.personal.location });

  return (
    <div
      id="a4-resume-preview"
      className="w-full bg-white text-zinc-800 shadow-2xl rounded-sm overflow-hidden"
      style={{
        aspectRatio: "1 / 1.414",
        fontFamily: "'Times New Roman', Georgia, serif",
        fontSize: "11px",
        lineHeight: "1.45",
      }}
    >
      <div className="px-10 py-8 h-full flex flex-col gap-3 overflow-y-auto print:p-8">

        {/* ── Header ── */}
        <header className="text-center">
          {/* Full Name — Small Caps style */}
          {resume.personal.fullName ? (
            <h1
              className="font-bold text-zinc-900 tracking-widest"
              style={{ fontSize: "22px", fontVariant: "small-caps", letterSpacing: "0.08em" }}
            >
              {resume.personal.fullName.toUpperCase()}
            </h1>
          ) : (
            <SkeletonLine width="45%" height="h-7" className="mx-auto mb-1" />
          )}

          {/* Role subtitle — shown if provided */}
          {resume.personal.role && (
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">
              {resume.personal.role}
            </p>
          )}

          {/* Contact line — single row with icon+text pairs */}
          {contactItems.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-zinc-700">
              {contactItems.map((item, idx) => (
                <span key={idx} className="flex items-center gap-0.5">
                  <span className="font-semibold">{item.icon}</span>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="underline underline-offset-1">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            !hasPersonal && (
              <div className="flex justify-center gap-3 mt-1">
                <SkeletonLine width="70px" height="h-2" />
                <SkeletonLine width="110px" height="h-2" />
                <SkeletonLine width="80px" height="h-2" />
              </div>
            )
          )}

          {/* Horizontal rule under header */}
          <div className="border-b border-zinc-700 mt-2" />
        </header>

        {/* ── Education ── */}
        {(hasEducation || !hasPersonal) && (
          <section>
            <SectionHeader title="Education" />
            <div className="space-y-2">
              {hasEducation ? (
                resume.education.map((edu) => (
                  <div key={edu.id}>
                    {/* Row 1: Institution (bold left) + Duration (right) */}
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-zinc-900">{edu.institution}</span>
                      <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{edu.duration}</span>
                    </div>
                    {/* Row 2: Degree (italic left) + Location (right) */}
                    <div className="flex justify-between items-baseline">
                      <span className="italic text-zinc-700">{edu.degree}</span>
                      <span className="text-[10px] text-zinc-500 shrink-0 ml-2">{edu.location}</span>
                    </div>
                    {edu.grade && <div className="text-[10px] text-zinc-500">GPA / Grade: {edu.grade}</div>}
                  </div>
                ))
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between"><SkeletonLine width="40%" height="h-3" /><SkeletonLine width="18%" height="h-2" /></div>
                  <SkeletonLine width="30%" height="h-2" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Summary ── */}
        {hasSummary && (
          <section>
            <SectionHeader title="Professional Summary" />
            <p className="text-zinc-700 text-[10.5px] leading-snug whitespace-pre-wrap">{resume.summary}</p>
          </section>
        )}

        {/* ── Projects ── */}
        {(hasProjects || !hasPersonal) && (
          <section>
            <SectionHeader title="Projects" />
            <div className="space-y-2">
              {hasProjects ? (
                resume.projects.map((proj) => (
                  <div key={proj.id}>
                    {/* Project name | Tech stack — matches image exactly */}
                    <div className="flex items-baseline flex-wrap gap-x-1.5">
                      <span className="font-bold text-zinc-900">{proj.title}</span>
                      {proj.techStack && (
                        <>
                          <span className="text-zinc-400">|</span>
                          <span className="italic text-zinc-600 text-[10px]">{proj.techStack}</span>
                        </>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-[9px] text-zinc-400 underline hover:text-zinc-600 ml-1">Live</a>
                      )}
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[9px] text-zinc-400 underline hover:text-zinc-600">GitHub</a>
                      )}
                    </div>
                    {/* Bullet points */}
                    {proj.bullets.length > 0 && (
                      <ul className="list-disc ml-5 space-y-0.5 mt-0.5 text-zinc-700 text-[10.5px]">
                        {proj.bullets.map((b, i) => b && <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-1.5">
                  <SkeletonLine width="30%" height="h-3" />
                  <SkeletonLine width="95%" />
                  <SkeletonLine width="80%" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Work Experience ── */}
        {(hasExperience || !hasPersonal) && (
          <section>
            <SectionHeader title="Work Experience" />
            <div className="space-y-2.5">
              {hasExperience ? (
                resume.experience.map((exp) => (
                  <div key={exp.id}>
                    {/* Row 1: Role (bold) + Duration */}
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-zinc-900">{exp.role}</span>
                      <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{exp.duration}</span>
                    </div>
                    {/* Row 2: Company (italic) + Location */}
                    <div className="flex justify-between items-baseline">
                      <span className="italic text-zinc-600 text-[10px]">{exp.company}</span>
                      <span className="text-[10px] text-zinc-500 shrink-0 ml-2">{exp.location}</span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc ml-5 space-y-0.5 mt-0.5 text-zinc-700 text-[10.5px]">
                        {exp.bullets.map((b, i) => b && <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between"><SkeletonLine width="40%" height="h-3" /><SkeletonLine width="20%" height="h-2" /></div>
                      <SkeletonLine width="28%" height="h-2" />
                      <SkeletonLine width="90%" />
                      <SkeletonLine width="75%" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Technical Skills ── */}
        {(hasSkills || !hasPersonal) && (
          <section>
            <SectionHeader title="Technical Skills" />
            {hasSkills ? (
              <div className="space-y-0.5 text-[10.5px]">
                {Object.entries(resume.skills).map(([key, list]) =>
                  list.length > 0 && (
                    <div key={key} className="flex gap-1.5">
                      <span className="font-bold text-zinc-900 capitalize min-w-[90px] shrink-0">{key}:</span>
                      <span className="text-zinc-700">{list.join(", ")}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex gap-2"><SkeletonLine width="80px" height="h-2.5" /><SkeletonLine width="160px" height="h-2.5" /></div>
                <div className="flex gap-2"><SkeletonLine width="90px" height="h-2.5" /><SkeletonLine width="140px" height="h-2.5" /></div>
              </div>
            )}
          </section>
        )}

        {/* ── Achievements / Certifications ── */}
        {hasAchievements && (
          <section>
            <SectionHeader title="Certifications" />
            <div className="space-y-2">
              {resume.achievements.map((ach) => (
                <div key={ach.id}>
                  {/* Cert name (bold) + Date right */}
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-zinc-900">{ach.title}</span>
                    {ach.link && (
                      <a href={ach.link} target="_blank" rel="noreferrer" className="text-[9px] text-zinc-400 underline hover:text-zinc-600 shrink-0 ml-2">
                        View
                      </a>
                    )}
                  </div>
                  {ach.description && (
                    <p className="text-[10px] text-zinc-600 mt-0.5">{ach.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/* ── Panel ───────────────────────────────────────────────────────────────── */
export default function ResumePreviewPanel() {
  const resume = useResumeStore((state) => state.resume);

  const handleDownload = async () => {
    const fileName = `${resume.personal.fullName || "resume"}.pdf`;
    await generatePDF("a4-resume-preview", fileName);
  };

  return (
    <section
      id="resume-preview-panel"
      aria-label="Live resume preview"
      className="
        relative flex flex-col
        bg-[#1a1a24]
        [background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:22px_22px]
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
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs hover:text-white hover:border-white/20 transition-all cursor-pointer"
        >
          <FiDownload className="text-xs" />
          Download PDF
        </button>
      </div>

      {/* A4 paper — centered */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-10 print:p-0 print:block">
        <div className="w-full max-w-[680px] print:max-w-none shadow-md print:shadow-none">
          <A4ResumePreview />
        </div>
      </div>
    </section>
  );
}
