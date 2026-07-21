import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import nodemailer from "nodemailer";
import { getEmailHTML, IEmailTemplateData } from "../templates/email.templates.js";
import { Logger } from "../../../infrastructure/logger/logger.js";
import { env } from "../../../config/env.js";

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
      this.redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 1,
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
        Logger.info("[EmailQueue] Redis active — BullMQ queue initialized.");

        const connection = new Redis({
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          password: env.REDIS_PASSWORD || undefined,
          maxRetriesPerRequest: null // Required by BullMQ
        });

        this.queue = new Queue("email-queue", { connection });

        this.worker = new Worker(
          "email-queue",
          async (job: Job<IEmailJobData>) => {
            await this.processEmailJob(job.data);
          },
          { connection }
        );

        this.worker.on("completed", (job) => {
          Logger.info(`[EmailQueue] Job ${job.id} (${job.data.type}) delivered to ${job.data.to}`);
        });

        this.worker.on("failed", (job, err) => {
          Logger.error(`[EmailQueue] Job ${job?.id} failed: ${err.message}`);
        });
      }
    } catch (err: any) {
      Logger.warn(`[EmailQueue] Redis unavailable (${err.message}) — falling back to in-memory dispatch.`);
      this.isRedisAvailable = false;
    }
  }

  private async processEmailJob(jobData: IEmailJobData): Promise<void> {
    const { to, type, data } = jobData;
    const { subject, html } = getEmailHTML(type, data);

    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
      });
      await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
    } else {
      Logger.info(`
      ─────────────────────────────────────────────
      ✉️  [MOCK EMAIL — configure SMTP to send real]
      To:       ${to}
      Subject:  ${subject}
      Template: ${type}
      Data:     ${JSON.stringify(data)}
      ─────────────────────────────────────────────
      `);
    }
  }

  async addEmailJob(to: string, type: string, data: IEmailTemplateData): Promise<void> {
    if (this.isRedisAvailable && this.queue) {
      await this.queue.add(
        "send-email",
        { to, type, data },
        { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
      );
    } else {
      // In-memory fallback — fire and forget
      setTimeout(async () => {
        try {
          await this.processEmailJob({ to, type, data });
        } catch (err: any) {
          Logger.error(`[EmailQueue] Fallback dispatch failed for ${to}: ${err.message}`);
        }
      }, 0);
    }
  }
}
