import pusher from './pusher';
import FirestoreService from "./FirestoreService";

import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, updateEntry, markAsReadEntry } from './database';
import { PrismaClient } from '@prisma/client';

const RESOURCE = 'notifications';

async function dispatchNotification(message) {
    await pusher.trigger(RESOURCE, message.login, message);
    return message;
}

async function dispatchNotificationMobile(message) {
    const notificacao = message.notificacao;

    if (!notificacao.context) {
        throw new Error('Contexto não informado');
    }
    const firestoreService = new FirestoreService(notificacao.context);

    await firestoreService.createNotification(notificacao);
}

export async function addNotification(context, notification) {
    const prisma = new PrismaClient();

    let { login } = notification;
    login = new String(login || '').toLowerCase();

    try {
        if (notification.mobile && !context) {
            throw new Error('Contexto necessário para notificação mobile.');
        }

        const result = await prisma.$transaction(async (tx) => {
            const createdNote = await insertEntry(login, notification, context, tx);
            const pendente = await getQttyPending(login, context, tx);

            const txResult = {
                login,
                pendente,
                notificacao: createdNote,
            }

            if (process.env.PUSHER_APP_ID) {
                await dispatchNotification(txResult);
            }

            if (createdNote.mobile === true) {
                await dispatchNotificationMobile(txResult);
            }

            return txResult;
        })

        return result;
    } catch (err) {
        throw err;
    }
}

export function updateNotification(notification) {
    if (!notification.pendente) {
        return deleteNotification(notification.id);
    }

    return updateEntry(notification);
}

export function getNotificationsByUser(login, context, skip = 0, limit = undefined) {
    return getData(login, context, skip, limit);
}

export function deleteNotification(id) {
    return inactivateEntry(id);
}

export function deleteAllNotifications(login) {
    return inactivateAllEntry(login);
}

export function getQttyPending(login, context, client = undefined) {
    return getQuantity(login, context, client);
}

export function getNotificationsQtde(login, context) {
    return getQuantity(login, context).then(pendente => pendente.qtde);
}

export function markAsReadNotification(id) {
    return markAsReadEntry(id)
}
