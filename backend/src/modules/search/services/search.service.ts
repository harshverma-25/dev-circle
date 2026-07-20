import mongoose from "mongoose";
import { Job } from "../../jobs/models/job.model.js";
import { Company } from "../../companies/models/company.model.js";
import { User } from "../../users/models/user.model.js";

export class SearchService {
  async searchJobs(params: any) {
    const {
      search,
      skills,
      location,
      salaryMin,
      salaryMax,
      experience,
      jobType,
      workMode,
      company,
      page = 1,
      limit = 10,
      sort
    } = params;

    const query: any = { status: "Published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (skills) {
      const skillsArray = typeof skills === "string" 
        ? skills.split(",").map(s => s.trim()) 
        : skills;
      query.skills = { $in: skillsArray };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (salaryMin !== undefined && salaryMin !== "") {
      query["salary.min"] = { $gte: Number(salaryMin) };
    }

    if (salaryMax !== undefined && salaryMax !== "") {
      query["salary.max"] = { $lte: Number(salaryMax) };
    }

    if (experience) {
      query.experienceLevel = { $regex: experience, $options: "i" };
    }

    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    if (workMode) {
      query.workMode = { $regex: workMode, $options: "i" };
    }

    if (company) {
      if (mongoose.Types.ObjectId.isValid(company)) {
        query.companyId = new mongoose.Types.ObjectId(company);
      } else {
        const companies = await Company.find({
          $or: [
            { name: { $regex: company, $options: "i" } },
            { slug: { $regex: company, $options: "i" } }
          ]
        });
        const companyIds = companies.map(c => c._id);
        query.companyId = { $in: companyIds };
      }
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    let sortQuery: any = { createdAt: -1 };
    if (sort) {
      if (sort === "newest") sortQuery = { createdAt: -1 };
      else if (sort === "oldest") sortQuery = { createdAt: 1 };
      else if (sort === "salary_desc") sortQuery = { "salary.max": -1 };
      else if (sort === "salary_asc") sortQuery = { "salary.min": 1 };
      else if (sort === "title_asc") sortQuery = { title: 1 };
      else if (sort === "title_desc") sortQuery = { title: -1 };
    }

    const total = await Job.countDocuments(query);
    const results = await Job.find(query)
      .populate("companyId", "name logo verificationStatus location")
      .sort(sortQuery)
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

  async searchDevelopers(params: any) {
    const {
      search,
      skills,
      location,
      experience,
      university,
      page = 1,
      limit = 10,
      sort
    } = params;

    // Developers have the 'student' role
    const query: any = { role: "student" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { headline: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ];
    }

    if (skills) {
      const skillsArray = typeof skills === "string" 
        ? skills.split(",").map(s => s.trim()) 
        : skills;
      query.skills = { $in: skillsArray };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (university) {
      query["education.institution"] = { $regex: university, $options: "i" };
    }

    if (experience) {
      query.$or = [
        { "experience.role": { $regex: experience, $options: "i" } },
        { "experience.company": { $regex: experience, $options: "i" } }
      ];
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    let sortQuery: any = { createdAt: -1 };
    if (sort) {
      if (sort === "newest") sortQuery = { createdAt: -1 };
      else if (sort === "oldest") sortQuery = { createdAt: 1 };
      else if (sort === "name_asc") sortQuery = { name: 1 };
      else if (sort === "name_desc") sortQuery = { name: -1 };
    }

    const total = await User.countDocuments(query);
    const results = await User.find(query, { password: 0 }) // Exclude password hashes
      .sort(sortQuery)
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

  async searchCompanies(params: any) {
    const {
      search,
      industry,
      location,
      companySize,
      verification,
      page = 1,
      limit = 10,
      sort
    } = params;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } }
      ];
    }

    if (industry) {
      query.industry = { $regex: industry, $options: "i" };
    }

    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } }
      ];
    }

    if (companySize) {
      query.companySize = { $regex: companySize, $options: "i" };
    }

    if (verification) {
      query.verificationStatus = verification;
    }

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    let sortQuery: any = { createdAt: -1 };
    if (sort) {
      if (sort === "newest") sortQuery = { createdAt: -1 };
      else if (sort === "oldest") sortQuery = { createdAt: 1 };
      else if (sort === "name_asc") sortQuery = { name: 1 };
      else if (sort === "name_desc") sortQuery = { name: -1 };
    }

    const total = await Company.countDocuments(query);
    const results = await Company.find(query)
      .sort(sortQuery)
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

  async getSuggestions(q: string, type?: string) {
    if (!q || q.length < 2) {
      return [];
    }

    const results: string[] = [];
    const limit = 5;

    if (!type || type === "jobs") {
      const jobs = await Job.find(
        { title: { $regex: q, $options: "i" }, status: "Published" },
        { title: 1 }
      ).limit(limit);
      results.push(...jobs.map(j => j.title));
    }

    if (!type || type === "developers") {
      const users = await User.find(
        { name: { $regex: q, $options: "i" }, role: "student" },
        { name: 1 }
      ).limit(limit);
      results.push(...users.map(u => u.name));
    }

    if (!type || type === "companies") {
      const companies = await Company.find(
        { name: { $regex: q, $options: "i" } },
        { name: 1 }
      ).limit(limit);
      results.push(...companies.map(c => c.name));
    }

    // Deduplicate and return top 10
    return Array.from(new Set(results)).slice(0, 10);
  }
}
