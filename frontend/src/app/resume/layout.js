export const metadata = {
  title: "Resume Builder | DevCircle",
  description:
    "Build a professional, ATS-optimized resume with the DevCircle Resume Builder.",
};

/**
 * Standalone layout for the /resume route.
 * Skips the global <Layout> (navbar / footer) so the
 * builder occupies the full viewport without any wrapper.
 */
export default function ResumeLayout({ children }) {
  return <>{children}</>;
}
