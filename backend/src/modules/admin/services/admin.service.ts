import mongoose from "mongoose";
import { User } from "../../users/models/user.model.js";
import { Company } from "../../companies/models/company.model.js";
import { Job } from "../../jobs/models/job.model.js";
import { Application } from "../../applications/models/application.model.js";
import { BannedUser } from "../models/banned-user.model.js";
import { NotFoundError } from "../../../shared/errors/custom.error.js";

export class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalRecruiters,
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      pendingCompanies,
      verifiedCompanies,
      publishedJobs,
      closedJobs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ role: "student" }),
      Company.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Company.countDocuments({ verificationStatus: "Pending" }),
      Company.countDocuments({ verificationStatus: "Verified" }),
      Job.countDocuments({ status: "Published" }),
      Job.countDocuments({ status: "Closed" })
    ]);

    return {
      stats: {
        users: {
          total: totalUsers,
          recruiters: totalRecruiters,
          students: totalStudents
        },
        companies: {
          total: totalCompanies,
          pending: pendingCompanies,
          verified: verifiedCompanies
        },
        jobs: {
          total: totalJobs,
          published: publishedJobs,
          closed: closedJobs
        },
        applications: {
          total: totalApplications
        }
      }
    };
  }

  async getUsers(params: any) {
    const { role, status, search, page = 1, limit = 10 } = params;
    const query: any = {};

    if (role) {
      query.role = role;
    }

    const bannedRecords = await BannedUser.find();
    const bannedUserIds = bannedRecords.map(b => b.userId.toString());

    if (status) {
      if (status === "banned") {
        query._id = { $in: bannedUserIds };
      } else if (status === "active") {
        query._id = { $nin: bannedUserIds };
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ];
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await User.countDocuments(query);
    const results = await User.find(query, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const mappedResults = results.map(user => {
      const u = user.toObject();
      (u as any).isBanned = bannedUserIds.includes(user._id.toString());
      return u;
    });

    return {
      results: mappedResults,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    };
  }

  async banUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await BannedUser.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { userId: new mongoose.Types.ObjectId(userId) },
      { upsert: true }
    );

    const userObj = user.toObject();
    (userObj as any).isBanned = true;
    delete (userObj as any).password;

    return { message: "User banned successfully", user: userObj };
  }

  async activateUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await BannedUser.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });

    const userObj = user.toObject();
    (userObj as any).isBanned = false;
    delete (userObj as any).password;

    return { message: "User activated successfully", user: userObj };
  }

  async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await BannedUser.deleteOne({ userId: new mongoose.Types.ObjectId(userId) });
    await User.findByIdAndDelete(userId);
    return { message: "User deleted successfully" };
  }

  async getCompanies(params: any) {
    const { verificationStatus, search, page = 1, limit = 10 } = params;
    const query: any = {};

    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } }
      ];
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Company.countDocuments(query);
    const results = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return {
      results,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    };
  }

  async verifyCompany(companyId: string) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new NotFoundError("Company not found");
    }

    company.verificationStatus = "Verified";
    await company.save();

    return { message: "Company verified successfully", company };
  }

  async rejectCompany(companyId: string) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new NotFoundError("Company not found");
    }

    company.verificationStatus = "Rejected";
    await company.save();

    return { message: "Company rejected successfully", company };
  }

  async deleteCompany(companyId: string) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new NotFoundError("Company not found");
    }

    await Company.findByIdAndDelete(companyId);
    return { message: "Company deleted successfully" };
  }

  async getJobs(params: any) {
    const { status, search, page = 1, limit = 10 } = params;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Job.countDocuments(query);
    const results = await Job.find(query)
      .populate("companyId", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return {
      results,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber)
      }
    };
  }

  async deleteJob(jobId: string) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    await Job.findByIdAndDelete(jobId);
    return { message: "Job deleted successfully" };
  }

  async closeJob(jobId: string) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    job.status = "Closed";
    await job.save();

    return { message: "Job closed successfully", job };
  }
}
