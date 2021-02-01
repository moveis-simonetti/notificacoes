import pusher from "./pusher";
import {sendNotification} from "./pushNotification";
import printf from "printf";

import {deleteEntry, getData, insertEntry, updateEntry} from "./redis";

const RESOURCE = 'notifications';

function dispatchNotification(message) {
    return new Promise((fulfill, reject) => {
        try {
            pusher.trigger(RESOURCE, message.login, message);
            sendNotification(message.login, message);
            fulfill(message);
        } catch (err) {
            reject(err);
        }
    });
}

export function addNotification(notification) {
    let {login} = notification;

    let now = new Date();

    notification.criacao = printf(
        "%d-%02d-%02d %d:%d:%d",
        now.getFullYear(),
        1 + now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    );

    return insertEntry(RESOURCE, login, notification)
        .then(notificacao => getQttyPending(login).then(pendente => ({login, pendente, notificacao})))
        .then(dispatchNotification);
}

export function updateNotification(notification) {
    if (!notification.pendente) {
        return deleteNotification(notification.login, notification._$key);
    }

    return updateEntry(RESOURCE, notification.login, notification);
}

export function getNotificationsByUser(login) {
    return getData(RESOURCE, login);
}

export function deleteNotification(login, _$key) {
    return deleteEntry(RESOURCE, login, {_$key});
}

export function getQttyPending(login) {
    return getData(RESOURCE, login)
        .then(data => ({
            qtde: data.length,
            registros_sonoros: data.filter(entry => entry.sonoro).length
        }));
}