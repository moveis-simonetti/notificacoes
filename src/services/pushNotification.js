import PushNotifications from '@pusher/push-notifications-server';

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY
});

export function sendNotification(login, { notificacao }) {
  const { assunto, conteudo, url_destino } = notificacao;
  beamsClient.publishToUsers([login], {
    web: {
      notification: {
        title: assunto,
        body: conteudo,
        deep_link: url_destino 
      }
    }
  }).then((publishResponse) => {
    console.log('Just published:', publishResponse.publishId);
  }).catch((error) => {
    console.error('Error:', error);
  });
} 

export default beamsClient;