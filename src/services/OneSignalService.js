import OneSignalClient from '../infra/OneSignalClient.js';

class OneSignalService {
  clients = new Map();

  async createPushNotification(context, notificacao) {
    if (!notificacao.login || !notificacao.assunto || !notificacao.conteudo) {
      throw new Error('Login, assunto e conteudo são obrigatórios');
    }

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
}

export default OneSignalService;
