export const metadata = {
  title: "Resume Builder | DevCircle",
  description:
    "Build a professional, ATS-optimized resume with the DevCircle Resume Builder.",
};

/**
 * Standalone layout for the resume builder.
 * Intentionally omits the global <Layout> (navbar / footer) so the
 * builder occupies the full viewport.
 */
export default function ResumeBuilderLayout({ children }) {
  return <>{children}</>;
}
