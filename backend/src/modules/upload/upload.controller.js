export const uploadResumeController = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  // multer-storage-cloudinary puts these on req.file
  const url       = req.file.path;          // full Cloudinary secure URL
  const publicId  = req.file.filename;      // Cloudinary public_id

  return res.status(200).json({
    success: true,
    url,
    publicId,
  });
};
