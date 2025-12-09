import FirestoreService from "./FirestoreService";
import pusher from './pusher';
import { PrismaClient } from '@prisma/client';
import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, markAsExcludedEntry, markAsReadEntry, updateEntry } from './database';
import OneSignalService from './OneSignalService';

class NotificationService {
    constructor() {
        this.RESOURCE = 'notifications';
        this.prisma = new PrismaClient();
        this.firestoreService = new FirestoreService();
        this.oneSignalService = new OneSignalService();
    }

    async dispatchNotification(message) {
        await pusher.trigger(this.RESOURCE, message.login, message);
        return message;
    }

    async dispatchNotificationMobile(message) {
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
            notificacao
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
                    await this.dispatchNotificationMobile(txResult);
                }

                return txResult;
            })
        } catch (err) {
            console.error('[NotificationService] Erro ao processar notificação:', err.message);
            return { error: err.message };
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
