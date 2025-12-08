import { defineSecret } from "firebase-functions/params";

export const webhookReadUrl = defineSecret("WEBHOOK_READ_URL");
export const webhookExcludedUrl = defineSecret("WEBHOOK_EXCLUDED_URL");
