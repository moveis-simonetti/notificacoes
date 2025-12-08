import { onDocumentCreated } from "firebase-functions/v2/firestore"
import NotificationsClient from "../clients/NotificationsClient"
import { notificacoesApiUrl } from "../config/params"
import { Notification } from "../types/Notification"

function createNotificationHandler(
  collectionPath: string,
  clientMethod: (
    client: NotificationsClient,
    login: string,
    id: string
  ) => Promise<any>
) {
  return onDocumentCreated(
    {
      document: collectionPath,
      secrets: [notificacoesApiUrl],
    },
    async (event) => {
      const notificationsClient = new NotificationsClient()

      const documento = event.data?.data() as Notification | undefined

      if (!documento) return

      const notificationId = event.params.notificationId
      const login = documento.login

      if (!notificationId || !login) return

      try {
        return await clientMethod(notificationsClient, login, notificationId)
      } catch (error) {
        throw error
      }
    }
  )
}

export const onNotificationRead = createNotificationHandler(
  "notificacoes_lidas/{notificationId}",
  (client, login, id) => client.markAsRead(login, id)
)

export const onNotificationRemoved = createNotificationHandler(
  "notificacoes_excluidas/{notificationId}",
  (client, login, id) => client.markDelete(login, id)
)
