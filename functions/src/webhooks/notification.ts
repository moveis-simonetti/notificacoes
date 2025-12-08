import axios from "axios";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {
  webhookNotificationReadUrl,
  webhookNotificationExcludedUrl,
} from "../config/params";

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

function createWebhookHandler(collectionPath: string, webhookSecret: string) {
  return onDocumentCreated(
    {
      document: collectionPath,
      secrets: [webhookSecret],
    },
    async (event) => {
      const notificationId = event.params.notificationId;

      if (!notificationId) return;

      return await callWebhook(webhookSecret, notificationId);
    }
  );
}

export const onNotificationRead = createWebhookHandler(
  "notificacoes_lidas/{notificationId}",
  webhookNotificationReadUrl.value()
);

export const onNotificationRemoved = createWebhookHandler(
  "notificacoes_excluidas/{notificationId}",
  webhookNotificationExcludedUrl.value()
);
