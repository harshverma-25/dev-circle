"use client";

import { useState, useRef } from "react";
import { useApplyInterview, uploadResumeFile } from "../hooks/useInterviews";
import { 
  FiLink, FiUpload, FiX, FiFileText, FiImage, FiLoader, 
  FiCheckCircle, FiAlertCircle, FiInfo, FiBriefcase, 
  FiExternalLink, FiFolder, FiCloud
} from "react-icons/fi";

export default function ApplyModal({ interview, onClose }) {
  const [tab, setTab]               = useState("url");   // "url" | "file"
  const [resumeUrl, setResumeUrl]   = useState("");
  const [message, setMessage]       = useState("");
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { mutate: apply, isPending, error: applyError } = useApplyInterview();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    validateAndSetFile(selected);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (selected) => {
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
        message:            message.trim(),
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
          message:            message.trim(),
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500/5 to-purple-500/5 px-6 pt-6 pb-4 border-b border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-0"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg mb-3">
                <FiBriefcase className="text-[#adc6ff]" size={12} />
                <span className="text-zinc-400 text-xs font-medium">Interview Application</span>
              </div>
              <h2 className="text-white font-bold text-xl mb-1">Apply for Position</h2>
              <p className="text-zinc-500 text-sm line-clamp-2">{interview.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-all p-2 rounded-xl hover:bg-white/10 transform hover:scale-110 active:scale-95"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-5">
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
            <button
              onClick={() => {
                setTab("url");
                setUploadError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === "url"
                  ? "bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FiLink size={14} /> 
              <span>Paste URL</span>
            </button>
            <button
              onClick={() => {
                setTab("file");
                setUploadError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === "file"
                  ? "bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FiUpload size={14} /> 
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {tab === "url" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiExternalLink size={12} />
                  Resume URL
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600">
                    <FiLink size={16} />
                  </div>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-resume"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-[#adc6ff]/50 focus:ring-1 focus:ring-[#adc6ff]/50 transition-all"
                  />
                </div>
                <div className="flex items-start gap-2 mt-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <FiInfo className="text-blue-400 text-sm flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Supports Google Drive, Dropbox, OneDrive, or any publicly accessible link
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiFolder size={12} />
                  Resume File
                </label>

                {/* Drop zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
                    ${dragActive 
                      ? "border-[#adc6ff] bg-[#adc6ff]/10" 
                      : "border-white/15 hover:border-[#adc6ff]/40 hover:bg-white/5"
                    }
                    ${file ? "bg-white/5" : ""}
                  `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        {file.type === "application/pdf"
                          ? <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                              <FiFileText size={32} className="text-red-400" />
                            </div>
                          : <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center">
                              <FiImage size={32} className="text-green-400" />
                            </div>
                        }
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                          <FiCheckCircle size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-sm font-medium break-all max-w-[200px]">{file.name}</p>
                        <p className="text-zinc-500 text-xs mt-1">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                        <p className="text-[#adc6ff] text-xs mt-2">Click to change file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
                        <FiCloud size={32} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-400 text-sm font-medium">Drop your resume here or click to browse</p>
                        <p className="text-zinc-600 text-xs mt-2">PDF, JPG, PNG, WEBP · Max 5 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2 mt-3 p-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  <FiAlertCircle className="text-amber-400 text-sm flex-shrink-0" size={14} />
                  <p className="text-amber-400/70 text-xs">
                    Uploaded files are automatically deleted after 48 hours for security
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Introduce yourself */}
          <div className="mt-4">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Introduce Yourself
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the host why you're a good fit..."
              rows={3}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-[#adc6ff]/50 focus:ring-1 focus:ring-[#adc6ff]/50 transition-all resize-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Errors */}
          {(uploadError || serverError) && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-red-400 text-sm flex-shrink-0 mt-0.5" size={16} />
                <p className="text-red-400 text-sm">{uploadError || serverError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-white/5 bg-white/5">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (tab === "url" ? !resumeUrl.trim() : !file)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] text-[#002e6a] font-semibold text-sm hover:shadow-lg hover:shadow-[#adc6ff]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 transform active:scale-95"
          >
            {isSubmitting
              ? (
                <>
                  <div className="relative">
                    <FiLoader size={16} className="animate-spin" />
                  </div>
                  <span>{uploading ? "Uploading Resume..." : "Submitting Application..."}</span>
                </>
              ) : (
                <>
                  <FiCheckCircle size={16} />
                  <span>Submit Application</span>
                </>
              )
            }
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}