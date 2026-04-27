"use client";

import { useState, useRef } from "react";
import { useApplyInterview, uploadResumeFile } from "../hooks/useInterviews";
import { FiLink, FiUpload, FiX, FiFileText, FiImage, FiLoader } from "react-icons/fi";

export default function ApplyModal({ interview, onClose }) {
  const [tab, setTab]               = useState("url");   // "url" | "file"
  const [resumeUrl, setResumeUrl]   = useState("");
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const { mutate: apply, isPending, error: applyError } = useApplyInterview();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(selected.type)) {
      setUploadError("Only PDF, JPG, PNG, or WEBP files are allowed.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5 MB.");
      return;
    }
    setUploadError("");
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (tab === "url") {
      if (!resumeUrl.trim()) return;
      apply({
        interviewId:        interview._id,
        resumeUrl:          resumeUrl.trim(),
        resumeType:         "link",
        cloudinaryPublicId: null,
      }, { onSuccess: onClose });
    } else {
      // File upload flow
      if (!file) return;
      setUploading(true);
      setUploadError("");
      try {
        const result = await uploadResumeFile(file);
        apply({
          interviewId:        interview._id,
          resumeUrl:          result.url,
          resumeType:         "file",
          cloudinaryPublicId: result.publicId,
        }, { onSuccess: onClose });
      } catch (err) {
        setUploadError(err?.response?.data?.message || "Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const isSubmitting = uploading || isPending;
  const serverError  = applyError?.response?.data?.message || applyError?.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-white font-semibold text-lg">Apply for Interview</h2>
            <p className="text-zinc-500 text-sm mt-0.5 truncate max-w-xs">{interview.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mx-6 mt-5 p-1 bg-[#1c1c1c] rounded-xl border border-white/5">
          <button
            onClick={() => setTab("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "url"
                ? "bg-[#adc6ff] text-[#002e6a]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiLink size={14} /> Paste URL
          </button>
          <button
            onClick={() => setTab("file")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "file"
                ? "bg-[#adc6ff] text-[#002e6a]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiUpload size={14} /> Upload File
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {tab === "url" ? (
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
                Resume URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-[#adc6ff]/50 transition-colors"
              />
              <p className="text-zinc-600 text-xs mt-2">
                Google Drive, Dropbox, or any publicly accessible link
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2">
                Resume File
              </label>

              {/* Drop zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-[#adc6ff]/40 hover:bg-white/2 transition-all group"
              >
                {file ? (
                  <>
                    {file.type === "application/pdf"
                      ? <FiFileText size={32} className="text-[#adc6ff]" />
                      : <FiImage size={32} className="text-[#4edea3]" />
                    }
                    <div className="text-center">
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB · Click to change
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FiUpload size={28} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm">Click to upload your resume</p>
                      <p className="text-zinc-600 text-xs mt-1">PDF, JPG, PNG, WEBP · Max 5 MB</p>
                    </div>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-amber-400/70 text-xs mt-2.5 flex items-center gap-1.5">
                <span>⏳</span>
                Uploaded files are automatically deleted after 2 days
              </p>
            </div>
          )}

          {/* Errors */}
          {(uploadError || serverError) && (
            <p className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {uploadError || serverError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (tab === "url" ? !resumeUrl.trim() : !file)}
            className="flex-1 py-3 rounded-xl bg-[#adc6ff] text-[#002e6a] font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting
              ? <><FiLoader size={14} className="animate-spin" /> {uploading ? "Uploading..." : "Applying..."}</>
              : "Submit Application"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
