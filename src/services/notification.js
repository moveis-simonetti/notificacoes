import pusher from './pusher';

import {getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, updateEntry, markAsReadEntry} from './database';

const RESOURCE = 'notifications';

function dispatchNotification(message) {
    return new Promise((fulfill, reject) => {
        try {
            pusher.trigger(RESOURCE, message.login, message);
            fulfill(message);
        } catch (err) {
            reject(err);
        }
    });
}

export async function addNotification(context, notification) {
    let {login} = notification;
    login = new String(login || '').toLowerCase();

    try {
        const createdNote = await insertEntry(login, notification);
        const pendente = await getQttyPending(login, context);

        const result = {
            login,
            pendente,
            notificacao: createdNote,
        };

        await dispatchNotification(result);

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
