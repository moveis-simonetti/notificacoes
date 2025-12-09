import axios from "axios";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {
  webhookNotificationReadUrl,
  webhookNotificationExcludedUrl,
} from "../config/params";
import type { defineSecret } from "firebase-functions/params";

const region = "southamerica-east1";

async function callWebhook(webhookUrl: string, id: string) {
  console.log("[callWebhook] Chamando webhook...", webhookUrl);

  const response = await axios.post(
    webhookUrl,
    { id },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    }
  );

  console.log("[callWebhook] Resposta do webhook...", response.data);

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
      console.log("[createWebhookHandler] notificationId...", notificationId);

      if (!notificationId) return;

      console.log(
        "[createWebhookHandler] Chamando webhook...",
        webhookSecret.value()
      );

      const response = await callWebhook(webhookSecret.value(), notificationId);

      console.log("[createWebhookHandler] Resposta do webhook...", response);

      return response;
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
