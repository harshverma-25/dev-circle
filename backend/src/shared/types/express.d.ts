export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
        role: "student" | "recruiter" | "admin";
      };
    }
  }
}
