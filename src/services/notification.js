import pusher from './pusher';
import printf from 'printf';

import {deleteAllEntry, deleteEntry, getData, getQuantity, insertEntry, updateEntry,} from './redis';

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

export function addNotification(notification) {
    let { login } = notification;
    login = new String(login || '').toLowerCase();

    let now = new Date();

    notification.criacao = printf(
        '%d-%02d-%02d %d:%d:%d',
        now.getFullYear(),
        1 + now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    );

    return insertEntry(RESOURCE, login, notification)
        .then((notificacao) =>
            getQttyPending(login).then((pendente) => ({
                login,
                pendente,
                notificacao,
            }))
        )
        .then(dispatchNotification);
}

export function updateNotification(notification) {
    if (!notification.pendente) {
        return deleteNotification(notification.login, notification._$key);
    }

    return updateEntry(RESOURCE, notification.login, notification);
}

export function getNotificationsByUser(login, start = 0, end = -1) {
    return getData(RESOURCE, login, start, end);
}

export function deleteNotification(login, _$key) {
    return deleteEntry(RESOURCE, login, { _$key });
}

export function deleteAllNotifications(login) {
    return deleteAllEntry(RESOURCE, login);
}

export function getQttyPending(login) {
    return getQuantity(RESOURCE, login);
}

export function getNotificationsQtde(login) {
    return getQuantity(RESOURCE, login).then(pendente => pendente.qtde);
}
