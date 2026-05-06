"use client";

import { FiUser } from "react-icons/fi";
import useResumeStore from "../../../store/useResumeStore";
import SectionWrapper from "./ui/SectionWrapper";
import FormField from "./ui/FormField";

export default function PersonalInfoSection({ isOpen, onToggle }) {
  const { personal } = useResumeStore((state) => state.resume);
  const setPersonal = useResumeStore((state) => state.setPersonal);

  const handleChange = (e) => {
    setPersonal({ [e.target.name]: e.target.value });
  };

  return (
    <SectionWrapper
      label="Personal Information"
      icon={FiUser}
      color="#adc6ff"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Full Name"
          id="personal-fullName"
          name="fullName"
          placeholder="e.g. Jane Doe"
          value={personal.fullName}
          onChange={handleChange}
        />
        <FormField
          label="Role / Title"
          id="personal-role"
          name="role"
          placeholder="e.g. Software Engineer"
          value={personal.role}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          id="personal-email"
          name="email"
          type="email"
          placeholder="e.g. jane@example.com"
          value={personal.email}
          onChange={handleChange}
        />
        <FormField
          label="Phone"
          id="personal-phone"
          name="phone"
          placeholder="e.g. +1 234 567 890"
          value={personal.phone}
          onChange={handleChange}
        />
        <FormField
          label="Location"
          id="personal-location"
          name="location"
          placeholder="e.g. San Francisco, CA"
          value={personal.location}
          onChange={handleChange}
        />
        <FormField
          label="LinkedIn URL"
          id="personal-linkedin"
          name="linkedin"
          placeholder="linkedin.com/in/..."
          value={personal.linkedin}
          onChange={handleChange}
        />
        <FormField
          label="GitHub URL"
          id="personal-github"
          name="github"
          placeholder="github.com/..."
          value={personal.github}
          onChange={handleChange}
        />
        <FormField
          label="Portfolio URL"
          id="personal-portfolio"
          name="portfolio"
          placeholder="jane.dev"
          value={personal.portfolio}
          onChange={handleChange}
        />
      </div>
    </SectionWrapper>
  );
}
