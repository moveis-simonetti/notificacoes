import pusher from './pusher';
import FirestoreService from "./FirestoreService";
import FirebaseClient from "../infra/FirebaseClient";

import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, updateEntry, markAsReadEntry} from './database';

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
    let { login } = notification;
    login = new String(login || '').toLowerCase();

    try {
        if (notification.mobile && !context) {
            throw new Error('Contexto necessário para notificação mobile.');
        }

        const createdNote = await insertEntry(login, notification, context);
        const pendente = await getQttyPending(login, context);

        const result = {
            login,
            pendente,
            notificacao: createdNote,
        };

        if (process.env.PUSHER_APP_ID) {
            await dispatchNotification(result);
        }

        if (createdNote.mobile === true) {
            await dispatchNotificationMobile(result);
        }

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

export function getQttyPending(login, context) {
    return getQuantity(login, context);
}

export function getNotificationsQtde(login, context) {
    return getQuantity(login, context).then(pendente => pendente.qtde);
}

export function markAsReadNotification(id) {
    return markAsReadEntry(id)
}
