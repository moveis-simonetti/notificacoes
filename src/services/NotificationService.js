import FirestoreService from "./FirestoreService";
import pusher from './pusher';
import { getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, markAsExcludedEntry, markAsReadEntry, updateEntry } from './database';
import ParametroService from "./ParametroService";
class NotificationService {
    constructor() {
        this.RESOURCE = 'notifications';
        
        this.firestoreService = new FirestoreService();
        this.parametroService = new ParametroService();
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

        if (!notificacao.login || !notificacao.assunto || !notificacao.conteudo) {
            throw new Error('Login, assunto e conteudo são obrigatórios');
        }

        await this.firestoreService.createNotification(
            notificacao.context,
            notificacao
        );
    }

    async addNotification(context, notification) {
        let { login } = notification;
        login = new String(login || '').toLowerCase();

        try {
            const createdNote = await insertEntry(login, notification, context);
            const pendente = await this.getQttyPending(login, context);

            const result = {
                login,
                pendente,
                notificacao: createdNote,
            }

            if (process.env.PUSHER_APP_ID) {
                await this.dispatchNotification(result);
            }

            if (createdNote.mobile === true) {
                await this.dispatchNotificationMobile(result);
            }

            return result;
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

    getQttyPending(login, context) {
        return getQuantity(login, context);
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
