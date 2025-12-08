import { defineSecret } from "firebase-functions/params";

export const webhookNotificationReadUrl = defineSecret(
  "WEBHOOK_NOTIFICATION_READ_URL"
);
export const webhookNotificationExcludedUrl = defineSecret(
  "WEBHOOK_NOTIFICATION_EXCLUDED_URL"
);
