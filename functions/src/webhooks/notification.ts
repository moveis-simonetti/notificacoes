import axios from "axios";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {
  webhookNotificationReadUrl,
  webhookNotificationExcludedUrl,
} from "../config/params";
import type { defineSecret } from "firebase-functions/params";

const region = "southamerica-east1";

async function callWebhook(webhookUrl: string, id: string) {
  const response = await axios.post(
    webhookUrl,
    { id },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    }
  );

  return response.data;
}

function createWebhookHandler(
  collectionPath: string,
  webhookSecret: ReturnType<typeof defineSecret>
) {
  return onDocumentCreated(
    {
      document: collectionPath,
      secrets: [webhookSecret],
      region,
    },
    async (event) => {
      const notificationId = event.params.notificationId;

      if (!notificationId) return;

      return await callWebhook(webhookSecret.value(), notificationId);
    }
  );
}

export const onNotificationRead = createWebhookHandler(
  "notificacoes_lidas/{notificationId}",
  webhookNotificationReadUrl
);

export const onNotificationRemoved = createWebhookHandler(
  "notificacoes_excluidas/{notificationId}",
  webhookNotificationExcludedUrl
);
