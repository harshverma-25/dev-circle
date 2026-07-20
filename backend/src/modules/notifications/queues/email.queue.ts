import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import nodemailer from "nodemailer";
import { getEmailHTML, IEmailTemplateData } from "../templates/email.templates.js";
import { Logger } from "../../../infrastructure/logger/logger.js";

export interface IEmailJobData {
  to: string;
  type: string;
  data: IEmailTemplateData;
}

export class EmailQueueService {
  private queue: Queue | null = null;
  private worker: Worker | null = null;
  private isRedisAvailable = false;
  private redisClient: Redis | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const host = process.env.REDIS_HOST || "127.0.0.1";
      const port = parseInt(process.env.REDIS_PORT || "6379", 10);

      this.redisClient = new Redis({
        host,
        port,
        maxRetriesPerRequest: 1, // Fail fast if Redis is down
        connectTimeout: 2000,
        lazyConnect: true
      });

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Redis connection timeout"));
        }, 2000);

        this.redisClient!.connect()
          .then(() => {
            clearTimeout(timeout);
            this.isRedisAvailable = true;
            resolve();
          })
          .catch((err: any) => {
            clearTimeout(timeout);
            reject(err);
          });
      });

      if (this.isRedisAvailable) {
        Logger.info("[Notification Queue] Redis is active. Setting up BullMQ...");
        
        // Connection for BullMQ
        const connection = new Redis({
          host,
          port,
          maxRetriesPerRequest: null // Required by BullMQ
        });

        this.queue = new Queue("email-queue", { connection });
        
        this.worker = new Worker("email-queue", async (job: Job<IEmailJobData>) => {
          await this.processEmailJob(job.data);
        }, { connection });

        this.worker.on("completed", (job) => {
          Logger.info(`[Notification Queue] Job ${job.id} of type ${job.data.type} sent to ${job.data.to} successfully`);
        });

        this.worker.on("failed", (job, err) => {
          Logger.error(`[Notification Queue] Job ${job?.id} failed with error: ${err.message}`);
        });
      }
    } catch (err: any) {
      Logger.warn(`[Notification Queue] Redis is not active (${err.message}). Falling back to in-memory async dispatch.`);
      this.isRedisAvailable = false;
    }
  }

  private async processEmailJob(jobData: IEmailJobData): Promise<void> {
    const { to, type, data } = jobData;
    const { subject, html } = getEmailHTML(type, data);

    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || "DevCircle <noreply@devcircle.com>";

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
      await transporter.sendMail({ from, to, subject, html });
    } else {
      // Mock SMTP logger fallback to screen
      Logger.info(`
      -------------------------------------------------------------
      ✉️  [MOCK EMAIL SENT]
      To:       ${to}
      Subject:  ${subject}
      Template: ${type}
      Data:     ${JSON.stringify(data)}
      -------------------------------------------------------------
      `);
    }
  }

  async addEmailJob(to: string, type: string, data: IEmailTemplateData): Promise<void> {
    if (this.isRedisAvailable && this.queue) {
      // Add to BullMQ with 3 retries and exponential backoff
      await this.queue.add(
        "send-email",
        { to, type, data },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000
          }
        }
      );
    } else {
      // In-memory async execution
      setTimeout(async () => {
        try {
          await this.processEmailJob({ to, type, data });
        } catch (err: any) {
          Logger.error(`[Notification Fallback] Failed to send email to ${to}: ${err.message}`);
        }
      }, 0);
    }
  }
}
