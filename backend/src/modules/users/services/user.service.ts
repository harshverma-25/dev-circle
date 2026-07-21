import { UserRepository } from "../repositories/user.repository.js";
import { ResumeRepository } from "../repositories/resume.repository.js";
import { NotFoundError, CustomError } from "../../../shared/errors/custom.error.js";
import cloudinary from "../../../config/cloudinary.js";
import { IUserDocument } from "../types/user.types.js";

export class UserService {
  private userRepo = new UserRepository();
  private resumeRepo = new ResumeRepository();

  private calculateProfileCompletion(user: IUserDocument, hasResume: boolean): number {
    let score = 0;
    if (user.username) score += 10;
    if (user.name) score += 10;
    if (user.headline) score += 10;
    if (user.bio) score += 10;
    if (user.phone) score += 10;
    if (user.location) score += 10;
    if (user.profilePicture?.url) score += 10;
    if (hasResume) score += 10;
    if (user.skills && user.skills.length > 0) score += 10;
    if (user.education && user.education.length > 0) score += 5;
    if (user.experience && user.experience.length > 0) score += 5;
    return score;
  }

  async getProfile(userId: string): Promise<any> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const resumeRecord = await this.resumeRepo.findByUserId(userId);
    const hasResume = !!resumeRecord;

    const completion = this.calculateProfileCompletion(user, hasResume);

    return {
      id: user._id.toString(),
      username: user.username || "",
      role: user.role,
      name: user.name,
      email: user.email,
      headline: user.headline || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      profilePicture: user.profilePicture?.url
        ? {
            url: user.profilePicture.url,
            publicId: user.profilePicture.publicId
          }
        : {},
      resume: resumeRecord
        ? {
            url: resumeRecord.url,
            uploadedAt: resumeRecord.createdAt
          }
        : {},
      skills: user.skills || [],
      education: user.education || [],
      experience: user.experience || [],
      socialLinks: user.socialLinks?.github || user.socialLinks?.linkedin || user.socialLinks?.portfolio || user.socialLinks?.leetcode || user.socialLinks?.codeforces || user.socialLinks?.hackerrank
        ? {
            github: user.socialLinks.github || "",
            linkedin: user.socialLinks.linkedin || "",
            portfolio: user.socialLinks.portfolio || "",
            leetcode: user.socialLinks.leetcode || "",
            codeforces: user.socialLinks.codeforces || "",
            hackerrank: user.socialLinks.hackerrank || ""
          }
        : {},
      profileCompletion: completion
    };
  }

  async updateProfile(userId: string, data: any): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    // Filter fields to avoid overwriting or changing email / username
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.headline !== undefined) updateData.headline = data.headline;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.location !== undefined) updateData.location = data.location;

    await this.userRepo.update(userId, updateData);
  }

  async updateSkills(userId: string, skills: string[]): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    await this.userRepo.update(userId, { skills });
  }

  async updateEducation(userId: string, education: any[]): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    await this.userRepo.update(userId, { education });
  }

  async updateExperience(userId: string, experience: any[]): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    await this.userRepo.update(userId, { experience });
  }

  async updateSocialLinks(userId: string, socialLinks: any): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    await this.userRepo.update(userId, { socialLinks });
  }

  async uploadResume(userId: string, file: Express.Multer.File | undefined): Promise<any> {
    if (!file) {
      throw new CustomError("Resume file is required", 400, "VALIDATION_ERROR");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    // Check if user already has a resume
    const existingResume = await this.resumeRepo.findByUserId(userId);
    if (existingResume) {
      try {
        // Delete old resume file from Cloudinary (requires resource_type raw for pdf)
        await cloudinary.uploader.destroy(existingResume.publicId, { resource_type: "raw" });
      } catch (err) {
        console.error("Failed to delete old resume from Cloudinary:", err);
      }
      await this.resumeRepo.deleteByUserId(userId);
    }

    // Save new resume metadata (file.path contains secure_url, file.filename contains public_id)
    const newResume = await this.resumeRepo.create(userId, file.path, file.filename);

    return {
      url: newResume.url,
      uploadedAt: newResume.createdAt
    };
  }

  async deleteResume(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const existingResume = await this.resumeRepo.findByUserId(userId);
    if (!existingResume) {
      throw new CustomError("No resume found to delete", 400, "VALIDATION_ERROR");
    }

    try {
      await cloudinary.uploader.destroy(existingResume.publicId, { resource_type: "raw" });
    } catch (err) {
      console.error("Failed to delete resume from Cloudinary:", err);
    }

    await this.resumeRepo.deleteByUserId(userId);
  }

  async uploadProfilePicture(userId: string, file: Express.Multer.File | undefined): Promise<void> {
    if (!file) {
      throw new CustomError("Profile picture is required", 400, "VALIDATION_ERROR");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    // If there is an existing profile picture in Cloudinary, delete it
    if (user.profilePicture?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      } catch (err) {
        console.error("Failed to delete old profile picture from Cloudinary:", err);
      }
    }

    await this.userRepo.update(userId, {
      profilePicture: {
        url: file.path,
        publicId: file.filename
      }
    });
  }

  async deleteProfilePicture(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    if (!user.profilePicture?.publicId) {
      throw new CustomError("No profile picture found to delete", 400, "VALIDATION_ERROR");
    }

    try {
      await cloudinary.uploader.destroy(user.profilePicture.publicId);
    } catch (err) {
      console.error("Failed to delete profile picture from Cloudinary:", err);
    }

    await this.userRepo.update(userId, {
      profilePicture: {
        url: "",
        publicId: ""
      }
    });
  }

  async getPublicProfile(username: string): Promise<any> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new CustomError("Public profile not found", 404, "PROFILE_NOT_FOUND");
    }

    return {
      username: user.username,
      name: user.name,
      headline: user.headline || "",
      bio: user.bio || "",
      location: user.location || "",
      profilePicture: user.profilePicture?.url
        ? {
            url: user.profilePicture.url
          }
        : {},
      skills: user.skills || [],
      education: user.education || [],
      experience: user.experience || [],
      socialLinks: user.socialLinks?.github || user.socialLinks?.linkedin || user.socialLinks?.portfolio || user.socialLinks?.leetcode || user.socialLinks?.codeforces || user.socialLinks?.hackerrank
        ? {
            github: user.socialLinks.github || "",
            linkedin: user.socialLinks.linkedin || "",
            portfolio: user.socialLinks.portfolio || "",
            leetcode: user.socialLinks.leetcode || "",
            codeforces: user.socialLinks.codeforces || "",
            hackerrank: user.socialLinks.hackerrank || ""
          }
        : {}
    };
  }
}
