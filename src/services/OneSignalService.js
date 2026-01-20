import OneSignalClient from '../infra/OneSignalClient.js';
import ParametroService from './ParametroService.js';

export const NOTIFICATION_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
}

class OneSignalService {
  BASE_ANDROID_CHANNEL_ID = 'onesignal.android_channel_id';
  clients = new Map();

  constructor() {
    this.parametroService = new ParametroService();
  }

  async createPushNotification(context, notificacao, priority = null) {
    const notificationData = {
      filters: [
        {
          "field": "tag",
          "key": "username",
          "relation": "=",
          "value": notificacao.login
        }
      ],
      target_channel: "push",
      headings: {
        en: notificacao.assunto
      },
      contents: {
        en: notificacao.conteudo
      }
    };

    const androidChannelId = priority 
      ? await this.getAndroidChannelIdByContextAndPriority(context, priority)
      : null;
      
    if (androidChannelId) {
      notificationData.android_channel_id = androidChannelId;
    }

    if (notificacao.subtitulo) {
      notificationData.subtitle = {
        en: notificacao.subtitulo
      }
    }

    if (notificacao.url_destino) {
      notificationData.url = notificacao.url_destino
    }

    const client = await this.getClient(context);
    const response = await client.post('/notifications', notificationData);

    return response.data;
  }

  async getClient(context) {
    if (!this.clients.has(context)) {
      const client = new OneSignalClient(context);
      this.clients.set(context, client);
    }

    return this.clients.get(context);
  }

  async getAndroidChannelIdByContextAndPriority(context, priority) {
      const key = `${this.BASE_ANDROID_CHANNEL_ID}.${priority}`;
      
      const parametro = await this.parametroService.buscarPorContextoEChave(context, key);

      if (!parametro || !parametro.valor) {
          return null;
      }

      return parametro.valor;
  }
}

export default OneSignalService;
