import FirestoreService from "./FirestoreService";
import pusher from './pusher';
import { PrismaClient } from '@prisma/client';
import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, markAsExcludedEntry, markAsReadEntry, updateEntry } from './database';
import OneSignalService, { NOTIFICATION_PRIORITY } from './OneSignalService';
import ParametroService from "./ParametroService";
class NotificationService {
    constructor() {
        this.RESOURCE = 'notifications';
        
        this.prisma = new PrismaClient();
        this.firestoreService = new FirestoreService();
        this.oneSignalService = new OneSignalService();
        this.parametroService = new ParametroService();
    }

    async dispatchNotification(message) {
        await pusher.trigger(this.RESOURCE, message.login, message);
        return message;
    }

    async dispatchNotificationMobile(message, priority = null) {
        const notificacao = message.notificacao;

        if (!notificacao.context) {
            throw new Error('Contexto necessário para notificação mobile.');
        }

        await this.firestoreService.createNotification(
            notificacao.context,
            notificacao
        );

        await this.oneSignalService.createPushNotification(
            notificacao.context,
            notificacao,
            priority
        );
    }

    async addNotification(context, notification) {
        let { login } = notification;
        login = new String(login || '').toLowerCase();

        try {
            return await this.prisma.$transaction(async (tx) => {
                const createdNote = await insertEntry(login, notification, context, tx);
                const pendente = await this.getQttyPending(login, context, tx);

                const txResult = {
                    login,
                    pendente,
                    notificacao: createdNote,
                }

                if (process.env.PUSHER_APP_ID) {
                    await this.dispatchNotification(txResult);
                }

                if (createdNote.mobile === true) {
                    await this.dispatchNotificationMobile(txResult, NOTIFICATION_PRIORITY.URGENT);
                }

                return txResult;
            })
        } catch (err) {
            console.error('[NotificationService] Erro ao processar notificação:', err.message);
            throw err;
        }
    }

    updateNotification(notification) {
        if (!notification.pendente) {
            return this.deleteNotification(notification.id);
        }

        return updateEntry(notification);
    }

    getNotificationsByUser(login, context, skip = 0, limit = undefined) {
        return getData(login, context, skip, limit);
    }

    deleteNotification(id) {
        return inactivateEntry(id);
    }

    deleteAllNotifications(login) {
        return inactivateAllEntry(login);
    }

    getQttyPending(login, context, client = undefined) {
        return getQuantity(login, context, client);
    }

    async getNotificationsQtde(login, context) {
        return getQuantity(login, context).then(pendente => pendente.qtde);
    }

    markAsReadNotification(id) {
        return markAsReadEntry(id);
    }

    markAsExcludedNotification(id) {
        return markAsExcludedEntry(id);
    }
}

export default NotificationService;
