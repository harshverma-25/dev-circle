import { NotificationService } from "../../modules/notifications/services/notification.service.js";

const notificationService = new NotificationService();

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  await notificationService.sendVerificationEmail(email, name, token);
};
