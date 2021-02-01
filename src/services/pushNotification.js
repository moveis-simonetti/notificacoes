import PushNotifications from '@pusher/push-notifications-server';

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY
});

export function sendNotification(login, data) {
  const { notificacao } = data;
  beamsClient.publishToUsers([login], {
    web: {
      notification: {
        title: notificacao.assunto,
        body: notificacao.conteudo,
        deep_link: notificacao.url_destino 
      }
    }
  }).then((publishResponse) => {
    console.log('Just published:', publishResponse.publishId);
  }).catch((error) => {
    console.error('Error:', error);
  });
} 

export default beamsClient;