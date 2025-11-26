import pusher from './pusher';
import FirestoreService from "./FirestoreService";

import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, updateEntry, markAsReadEntry } from './database';
import { PrismaClient } from '@prisma/client';

class NotificationService {
    constructor() {
        this.RESOURCE = 'notifications';
        this.firestoreService = new FirestoreService();
        this.prisma = new PrismaClient();
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
            notificacao,
            notificacao.context
        );
    }

    async addNotification(context, notification) {
        let { login } = notification;
        login = new String(login || '').toLowerCase();

        try {
            const result = await this.prisma.$transaction(async (tx) => {
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

            return result;
        } catch (err) {
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
}

export default NotificationService;
