import FirestoreService from "./FirestoreService";
import pusher from './pusher';
import { PrismaClient } from '@prisma/client';
import { findByIdempotencia, getData, getQuantity, inactivateAllEntry, inactivateEntry, insertEntry, isIdempotenciaDuplicada, markAsDispatchedEntry, markAsExcludedEntry, markAsReadEntry, updateEntry } from './database';
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

        if (!notificacao.login || !notificacao.assunto || !notificacao.conteudo) {
            throw new Error('Login, assunto e conteudo são obrigatórios');
        }

        await Promise.all([
            this.firestoreService.createNotification(notificacao.context, notificacao),
            this.oneSignalService.createPushNotification(notificacao.context, notificacao, priority),
        ]);
    }

    async addNotification(context, notification) {
        const login = String(notification.login || '').toLowerCase();

        try {
            const existente = await this.buscarPorIdempotencia(notification);

            if (existente?.disparadaEm) {
                return this.montarResultado(login, context, existente);
            }

            const notificacao = existente ?? await this.inserir(context, notification);
            const resultado = await this.montarResultado(login, context, notificacao);

            await this.disparar(resultado);
            await markAsDispatchedEntry(notificacao.id);

            return resultado;
        } catch (err) {
            console.error('[NotificationService] Erro ao processar notificação:', err.message);
            throw err;
        }
    }

    async buscarPorIdempotencia(notification) {
        return notification.idempotencia
            ? findByIdempotencia(notification.login, notification.idempotencia)
            : null;
    }

    async inserir(context, notification) {
        try {
            return await insertEntry(notification.login, notification, context);
        } catch (err) {
            if (notification.idempotencia && isIdempotenciaDuplicada(err)) {
                return this.buscarPorIdempotencia(notification);
            }

            throw err;
        }
    }

    async montarResultado(login, context, notificacao) {
        return {
            login,
            pendente: await this.getQttyPending(login, context),
            notificacao,
        };
    }

    async disparar(resultado) {
        if (process.env.PUSHER_APP_ID) {
            await this.dispatchNotification(resultado);
        }

        if (resultado.notificacao.mobile === true) {
            await this.dispatchNotificationMobile(resultado, NOTIFICATION_PRIORITY.URGENT);
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
