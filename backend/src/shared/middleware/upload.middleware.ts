import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// @ts-ignore
import cloudinary from "../../config/cloudinary.js";

// Cloudinary storage configuration for Resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: {
    folder: "dev-circle/resumes",
    allowed_formats: ["pdf"],
    resource_type: "raw" // Keep PDF intact
  } as any
});

// Cloudinary storage configuration for Profile Pictures
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: {
    folder: "dev-circle/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image",
    transformation: [{ width: 400, height: 400, crop: "limit" }] // Resize before upload as per SPEC
  } as any
});

// File filters
const resumeFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for resumes"), false);
  }
};

const avatarFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"), false);
  }
};

export const uploadResumeMiddleware = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
}).single("resume");

export const uploadAvatarMiddleware = multer({
  storage: avatarStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB limit
}).single("profilePicture");

// Cloudinary storage configuration for Company Logos
const companyLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: {
    folder: "dev-circle/companies/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image",
    transformation: [{ width: 400, height: 400, crop: "limit" }] // Resize before upload
  } as any
});

// Cloudinary storage configuration for Company Banners
const companyBannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: {
    folder: "dev-circle/companies/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image"
  } as any
});

export const uploadCompanyLogoMiddleware = multer({
  storage: companyLogoStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB limit
}).single("logo");

export const uploadCompanyBannerMiddleware = multer({
  storage: companyBannerStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
}).single("banner");

